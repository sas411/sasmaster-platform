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
    # A missing session_id must never collapse to a shared marker name —
    # that would let a skill loaded in one session satisfy the gate in
    # another. There's no identifier here that both this (reader) process
    # and the separate skill_loaded_marker.py (writer) process can agree
    # on other than session_id itself, so treat "no session_id" as "no
    # marker" rather than inventing one — this fails the gate closed
    # (blocks) instead of leaking across sessions.
    if not session_id:
        return None
    return os.path.join(tempfile.gettempdir(), f"sasmaster-skillgate-{session_id}")


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
    fields = ["file_path", "command"]
    if tool == "Write":
        # Write is the main file-authoring vector for gated content (e.g. a
        # model writing gated SQL into run.sql, then executing it via a
        # generic runner whose command string doesn't match any pattern).
        # Matching the content here is cheap and closes that direct bypass.
        fields.append("content")
    target = " ".join(str(ti.get(k, "")) for k in fields)
    if not target.strip():
        return 0
    # Cap match input length: an unbounded string handed to a user-editable
    # regex risks catastrophic backtracking hanging every tool call.
    target = target[:4096]

    loaded = set()
    path = marker_path(evt.get("session_id", ""))
    if path:
        try:
            with open(path) as f:
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
        required = gate.get("require")
        if not required or required in loaded:
            continue
        sys.stderr.write(
            f"BLOCKED by skill-gate: load the '{required}' skill (Skill tool) "
            f"before this operation, then retry the same call. "
            f"Reason: {gate.get('reason', 'constitutional skill required for this path')}\n"
        )
        return 2

    return 0


if __name__ == "__main__":
    # Fail open: an unexpected error must never block or disrupt the session.
    try:
        sys.exit(main())
    except Exception:
        sys.exit(0)
