#!/usr/bin/env python3
"""UserPromptSubmit hook: deterministic skill routing.

Reads the hook event from stdin, matches the prompt against
routing-table.json, and prints ONE line naming up to 3 skills to load.
Silent when nothing matches. Never blocks, never fails the prompt.
"""

import json
import os
import re
import sys
import time

MAX_SUGGESTIONS = 3


def log_event(session_id, event, skills):
    path = os.environ.get(
        "SKILL_ROUTING_LOG",
        os.path.expanduser("~/SaSMaster/logs/skill-routing.jsonl"),
    )
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "a") as f:
            f.write(
                json.dumps(
                    {
                        "ts": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "session": session_id,
                        "event": event,
                        "skills": skills,
                    }
                )
                + "\n"
            )
    except OSError:
        pass


def main():
    table_path = (
        sys.argv[1]
        if len(sys.argv) > 1
        else os.path.join(os.path.dirname(os.path.abspath(__file__)), "routing-table.json")
    )
    try:
        table = json.load(open(table_path))
        evt = json.load(sys.stdin)
    except (ValueError, OSError):
        return 0

    prompt = (evt.get("prompt") or "").lower()
    if len(prompt) < 8:
        return 0

    min_score = table.get("min_score", 2)
    scored = []
    for skill, cfg in table.get("skills", {}).items():
        score = 0
        for kw in cfg.get("keywords", []):
            if not kw:
                continue
            if " " in kw:
                if re.search(r"\b" + re.escape(kw) + r"\b", prompt):
                    score += 3
            elif re.search(r"\b" + re.escape(kw) + r"\b", prompt):
                score += 1
        if score >= min_score:
            scored.append((score, skill))

    if not scored:
        return 0
    scored.sort(reverse=True)
    names = [s for _, s in scored[:MAX_SUGGESTIONS]]
    log_event(evt.get("session_id", ""), "suggested", names)
    print("Skill routing: load before acting -> " + ", ".join(names))
    return 0


if __name__ == "__main__":
    # Fail open: an unexpected error must never disrupt the session.
    try:
        sys.exit(main())
    except Exception:
        sys.exit(0)
