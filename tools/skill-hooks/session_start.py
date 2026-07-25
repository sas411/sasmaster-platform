#!/usr/bin/env python3
"""SessionStart hook: deterministic baseline skill load for SaSMaster work.

Takes sasmaster-context OUT of the routing problem: every session whose
cwd is SaSMaster-related gets one line instructing the baseline load.
Silent in unrelated projects (this hook lives in user settings and fires
everywhere).
"""

import json
import os
import sys
import time


def main():
    try:
        evt = json.load(sys.stdin)
    except (ValueError, OSError):
        return 0

    cwd = (evt.get("cwd") or os.getcwd()).lower()
    if "sasmaster" not in cwd:
        return 0

    print(
        "SaSMaster session: load the sasmaster-context skill FIRST "
        "(BRAIN-001 L2 rehydration) before any platform work. "
        "L3 ground truth: sasmaster.ops.platform_state."
    )

    log_path = os.environ.get(
        "SKILL_ROUTING_LOG",
        os.path.expanduser("~/SaSMaster/logs/skill-routing.jsonl"),
    )
    try:
        os.makedirs(os.path.dirname(log_path), exist_ok=True)
        with open(log_path, "a") as f:
            f.write(
                json.dumps(
                    {
                        "ts": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "session": evt.get("session_id", ""),
                        "event": "session_start",
                        "skills": ["sasmaster-context"],
                    }
                )
                + "\n"
            )
    except OSError:
        pass
    return 0


if __name__ == "__main__":
    # Fail open: an unexpected error must never disrupt the session.
    try:
        sys.exit(main())
    except Exception:
        sys.exit(0)
