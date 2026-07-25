#!/usr/bin/env python3
"""Weekly routing-accuracy report (step 5 of the skill-hooks loop).

Reads skill-routing.jsonl and diffs suggestions against actual loads
per session:
  - suggested-but-not-loaded  -> injection too weak, or false-positive keyword
  - loaded-but-not-suggested  -> missing keyword; add to frontmatter/overrides
The residual RT-PATH-SKILLS miss rate is the KPI to drive to zero.

Usage: routing_report.py [--since DAYS] [--log PATH]
"""

import argparse
import json
import os
import sys
import time
from collections import Counter, defaultdict


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", type=int, default=7, help="days back to include")
    ap.add_argument(
        "--log",
        default=os.environ.get(
            "SKILL_ROUTING_LOG",
            os.path.expanduser("~/SaSMaster/logs/skill-routing.jsonl"),
        ),
    )
    args = ap.parse_args()

    cutoff = time.strftime(
        "%Y-%m-%dT%H:%M:%S", time.localtime(time.time() - args.since * 86400)
    )
    sessions = defaultdict(lambda: {"suggested": set(), "loaded": set()})
    skipped_no_session = 0
    try:
        with open(args.log) as f:
            for line in f:
                try:
                    o = json.loads(line)
                except ValueError:
                    continue
                if o.get("ts", "") < cutoff:
                    continue
                sid = o.get("session", "")
                if not sid:
                    skipped_no_session += 1
                    continue
                if sid.startswith("__"):
                    # reserved for synthetic sessions (e.g. install.sh's
                    # smoke test) — never real usage, exclude from stats
                    continue
                if o.get("event") == "suggested":
                    sessions[sid]["suggested"].update(o.get("skills", []))
                elif o.get("event") == "loaded":
                    sessions[sid]["loaded"].update(o.get("skills", []))
    except OSError:
        print(f"no log at {args.log}")
        return 1

    if not sessions:
        print(f"no routing events in the last {args.since}d")
        if skipped_no_session:
            print(f"  ({skipped_no_session} events skipped: missing session_id)")
        return 0

    ignored = Counter()   # suggested, never loaded
    unrouted = Counter()  # loaded, never suggested
    followed = Counter()  # suggested and loaded
    for s in sessions.values():
        for sk in s["suggested"] - s["loaded"]:
            ignored[sk] += 1
        for sk in s["loaded"] - s["suggested"]:
            unrouted[sk] += 1
        for sk in s["suggested"] & s["loaded"]:
            followed[sk] += 1

    n_sugg = sum(ignored.values()) + sum(followed.values())
    hit = (sum(followed.values()) / n_sugg * 100) if n_sugg else 0.0

    print(f"SKILL ROUTING REPORT — last {args.since}d, {len(sessions)} sessions")
    if skipped_no_session:
        print(f"  WARNING: {skipped_no_session} events skipped (missing session_id, excluded from stats)")
    print(f"  suggestion follow-rate: {hit:.0f}% ({sum(followed.values())}/{n_sugg})")
    print("  suggested but NOT loaded (weak injection / false-positive keyword):")
    for sk, n in ignored.most_common(10):
        print(f"    {sk}: {n}")
    if not ignored:
        print("    none")
    print("  loaded but NOT suggested (missing keyword -> add to frontmatter/overrides):")
    for sk, n in unrouted.most_common(10):
        print(f"    {sk}: {n}")
    if not unrouted:
        print("    none")
    return 0


if __name__ == "__main__":
    sys.exit(main())
