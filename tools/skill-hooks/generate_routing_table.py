#!/usr/bin/env python3
"""Generate routing-table.json from skill frontmatter descriptions.

Harvests trigger keywords out of each skill's SKILL.md description so the
UserPromptSubmit router can match deterministically. Run this after every
skill sync (sync_skills.sh) so the table never drifts from the skills.

Usage:
  generate_routing_table.py --skills-dir ~/.claude/skills/user \
      [--skills-dir ~/.claude/skills] \
      [--overrides routing-overrides.json] \
      [--out routing-table.json]
"""

import argparse
import json
import os
import re
import sys

# Single words too generic to be routing signal on their own.
GENERIC = set(
    """use user when whenever any all also task tasks the this that with for and
    or not data file files new work working build builds building create make add
    like before after every during trigger triggers triggering load loads loaded
    skill skills claude code should would could про your what which where about
    into from over under between them then than always never please help using
    request requests asked asking mention mentions""".split()
)

MAX_KEYWORDS_PER_SKILL = 50
MAX_PHRASE_WORDS = 6


def parse_frontmatter(skill_md_path):
    try:
        txt = open(skill_md_path, encoding="utf-8", errors="replace").read()
    except OSError:
        return None, None
    m = re.match(r"^---\s*\n(.*?)\n---", txt, re.S)
    if not m:
        return None, None
    fm = m.group(1)
    name_m = re.search(r"^name:\s*(.+)$", fm, re.M)
    desc_m = re.search(r"^description:\s*(.*?)(?=\n[A-Za-z_-]+:|\Z)", fm, re.S | re.M)
    name = name_m.group(1).strip() if name_m else None
    desc = " ".join((desc_m.group(1) if desc_m else "").split())
    return name, desc


def clean_part(part):
    part = part.strip(" \"'`—–-.:;").lower()
    part = re.sub(
        r"^(any (mention|request|use) of|mention of|asking (about|to|for)|asks? (about|to|for)|requests? to|when (the )?user)\s+",
        "",
        part,
    )
    return part.strip()


def extract_keywords(name, desc):
    kws = set()
    kws.add(name.lower())
    spaced = name.replace("-", " ").lower()
    if spaced != name.lower():
        kws.add(spaced)
    # Distinctive tokens of the name itself ("nielsen" from nielsen-sme).
    for tok in re.split(r"[-_]", name.lower()):
        if len(tok) >= 4 and tok not in GENERIC:
            kws.add(tok)

    # Quoted phrases anywhere in the description are deliberate triggers.
    for q in re.findall(r'"([^"]{3,60})"', desc):
        q = clean_part(q)
        if q and len(q.split()) <= MAX_PHRASE_WORDS:
            kws.add(q)

    # Segments introduced by "Trigger on:", "Triggers:", "Trigger whenever", etc.
    for seg in re.finditer(
        r"[Tt][Rr][Ii][Gg][Gg][Ee][Rr][Ss]?\s*(?:on|whenever|when)?\s*:?\s+(.{10,900}?)"
        r"(?=Do NOT|Disambiguation|Also trigger|This skill|$)",
        desc,
    ):
        for part in re.split(r"[,;·]|\bor\b|\band\b", seg.group(1)):
            part = clean_part(part)
            if not (3 <= len(part) <= 60):
                continue
            words = part.split()
            if len(words) > MAX_PHRASE_WORDS:
                continue
            if len(words) == 1 and (len(part) < 4 or part in GENERIC):
                continue
            kws.add(part)

    return sorted(kws)[:MAX_KEYWORDS_PER_SKILL]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--skills-dir", action="append", required=True)
    ap.add_argument("--overrides", default=None)
    ap.add_argument("--out", default="routing-table.json")
    args = ap.parse_args()

    overrides = {}
    if args.overrides and os.path.exists(args.overrides):
        overrides = json.load(open(args.overrides))

    # Skills disabled via skillOverrides can't load — never route to them.
    disabled = set()
    settings_path = os.path.expanduser("~/.claude/settings.json")
    if os.path.exists(settings_path):
        try:
            so = json.load(open(settings_path)).get("skillOverrides") or {}
            disabled = {k for k, v in so.items() if v == "off"}
        except (ValueError, OSError):
            pass

    skills = {}
    for d in args.skills_dir:
        d = os.path.expanduser(d)
        if not os.path.isdir(d):
            continue
        for entry in sorted(os.listdir(d)):
            skill_md = os.path.join(d, entry, "SKILL.md")
            if not os.path.isfile(skill_md):
                continue
            name, desc = parse_frontmatter(skill_md)
            if not name:
                name = entry
            if name in skills:  # first dir listed wins (canonical first)
                continue
            if name in disabled or entry in disabled:
                continue
            skills[name] = {"keywords": extract_keywords(name, desc or "")}

    for skill, extra in (overrides.get("extra_keywords") or {}).items():
        skills.setdefault(skill, {"keywords": []})
        merged = sorted(set(skills[skill]["keywords"]) | {k.lower() for k in extra})
        skills[skill]["keywords"] = merged[:MAX_KEYWORDS_PER_SKILL]

    table = {
        "min_score": overrides.get("min_score", 2),
        "gates": overrides.get("gates", []),
        "skills": skills,
    }
    with open(args.out, "w") as f:
        json.dump(table, f, indent=1, sort_keys=True)
    total_kw = sum(len(v["keywords"]) for v in skills.values())
    print(f"routing-table: {len(skills)} skills, {total_kw} keywords -> {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
