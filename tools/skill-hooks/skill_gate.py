#!/usr/bin/env python3
"""PreToolUse hook: hard gate for constitutional skills.

Blocks (exit 2) a tool call whose target matches a gate pattern in
routing-table.json when the required skill has not been loaded this
session. The block message names the exact remedy so the model can
self-heal in one turn. Gates are defined in routing-overrides.json and
should cover ONLY irreversible-cost paths (spine writes, locked S3
layout, model egress) — over-blocking teaches the model to route around
hooks.
"""

import json
import os
import re
import sys
import tempfile


def marker_path(session_id):
    return os.path.join(
        tempfile.gettempdir(), f"sasmaster-skillgate-{session_id or 'na'}"
    )


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

    tool = evt.get("tool_name", "")
    ti = evt.get("tool_input") or {}
    # Only inspect path/command fields — file content is huge and not a target.
    target = " ".join(str(ti.get(k, "")) for k in ("file_path", "command"))
    if not target.strip():
        return 0

    loaded = set()
    try:
        with open(marker_path(evt.get("session_id", ""))) as f:
            loaded = set(f.read().split())
    except OSError:
        pass

    for gate in table.get("gates", []):
        if tool not in gate.get("tools", ["Bash", "Edit", "Write"]):
            continue
        try:
            if not re.search(gate["pattern"], target, re.I):
                continue
        except re.error:
            continue
        required = gate["require"]
        if required in loaded:
            continue
        sys.stderr.write(
            f"BLOCKED by skill-gate: load the '{required}' skill (Skill tool) "
            f"before this operation, then retry the same call. "
            f"Reason: {gate.get('reason', 'constitutional skill required for this path')}\n"
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
