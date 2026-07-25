#!/usr/bin/env python3
"""PostToolUse hook (matcher: Skill): record loaded skills.

Appends the loaded skill name to the per-session marker file (consumed by
skill_gate.py) and logs a 'loaded' event for the accuracy report.
"""

import json
import os
import sys
import tempfile
import time


def main():
    try:
        evt = json.load(sys.stdin)
    except (ValueError, OSError):
        return 0

    ti = evt.get("tool_input") or {}
    skill = str(ti.get("skill", "")).strip()
    if not skill:
        return 0
    # Directory-scoped skills appear as "<dir>:<name>" — record both forms.
    names = {skill, skill.split(":")[-1]}

    session_id = evt.get("session_id", "")
    # No session_id means no marker file skill_gate.py can look up for this
    # session specifically — writing to a shared fallback name would let
    # this load satisfy the gate in an unrelated session, so skip the
    # marker write entirely rather than share one across sessions.
    if session_id:
        marker = os.path.join(
            tempfile.gettempdir(), f"sasmaster-skillgate-{session_id}"
        )
        try:
            with open(marker, "a") as f:
                f.write("\n".join(sorted(names)) + "\n")
        except OSError:
            pass

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
                        "session": session_id,
                        "event": "loaded",
                        "skills": sorted(names),
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
