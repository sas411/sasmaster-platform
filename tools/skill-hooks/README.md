# SaSMaster Skill-Hooks Kit

Deterministic skill routing for Claude Code — fixes the pattern where the
`RT-PATH-SKILLS` control-plane hook scolds *after* a routing miss instead of
preventing it. Six pieces, mapped to the design doc:

| # | Piece | File | Hook event |
|---|---|---|---|
| 1 | Prompt-time router (inject, don't remind) | `skill_router.py` | UserPromptSubmit |
| 2 | Generated routing table (single source: skill frontmatter) | `generate_routing_table.py` → `routing-table.json` | build artifact |
| 3 | Hard gate for constitutional skills | `skill_gate.py` | PreToolUse (Edit\|Write\|Bash) |
| 4 | Deterministic baseline load (`sasmaster-context`) | `session_start.py` | SessionStart |
| 5 | Accuracy measurement loop | `skill_loaded_marker.py` + `routing_report.py` | PostToolUse (Skill) + weekly cron |
| 6 | Hygiene: fast, local, silent-by-default | all of the above | — |

## Install (on the Mac)

```bash
bash tools/skill-hooks/install.sh --dry-run   # preview
bash tools/skill-hooks/install.sh             # install + merge settings (backs up first)
```

The installer copies the kit to `~/SaSMaster/hooks/`, generates
`routing-table.json` from `~/.claude/skills/user/` (canonical, wins on
collisions) + `~/.claude/skills/`, and appends four hook entries to
`~/.claude/settings.json` (backup saved next to it). It then prints the
`sync_skills.sh` one-liner and cron lines to finish wiring — those two edits
stay manual because they touch files this kit doesn't own.

## How the pieces behave

- **Router** (`skill_router.py`): matches the prompt against harvested trigger
  keywords (phrases score 3, distinctive words 1; suggest at score ≥ 2, top 3
  skills, one line). Silent when nothing matches — no per-prompt token tax.
  Skills disabled via `skillOverrides: "off"` are excluded at table-generation
  time so the router never suggests a skill that can't load.
- **Gate** (`skill_gate.py`): blocks with exit 2 + a remedy message when a tool
  call hits a gated pattern before the required skill is loaded this session.
  Ships with three conservative gates (S3 locked-path writes, Parent Key spine
  mutations, non-Claude model calls → `model-gateway`). Extend in
  `routing-overrides.json` — gate only irreversible-cost paths.
- **Marker** (`skill_loaded_marker.py`): records each Skill-tool load in
  `$TMPDIR/sasmaster-skillgate-<session_id>` (consumed by the gate, so a block
  clears itself the moment the skill loads) and logs a `loaded` event.
- **Session start** (`session_start.py`): one line instructing the
  `sasmaster-context` load — only when cwd contains `sasmaster`, silent
  elsewhere (the hook lives in user settings and fires in every project).
- **Report** (`routing_report.py --since 7`): per-session diff of suggested vs
  loaded. `suggested-but-not-loaded` = weak injection or false-positive
  keyword; `loaded-but-not-suggested` = missing keyword (add it to the skill's
  frontmatter, or to `extra_keywords` in `routing-overrides.json`, then
  regenerate). The KPI: RT-PATH-SKILLS residual firings → zero.

## Tuning

- `min_score` (default 2) in `routing-overrides.json`: raise to 3 if the
  router is noisy, drop to 1 only for debugging.
- All logging goes to `~/SaSMaster/logs/skill-routing.jsonl`
  (override: `SKILL_ROUTING_LOG`).
- Everything is stdlib Python, no network, no DB — keep it that way; these run
  on every prompt/tool call and must stay well under 150 ms.

## Relationship to the description-trim pass

This kit is the deterministic backstop, not a replacement for fixing the
listing budget: the canonical skill descriptions still carry the long trigger
lists that bloat the always-resident skill listing (~9.3k est. tokens vs a
~2k budget → truncation → native routing misses). Once this table exists, the
trigger lists can move OUT of descriptions (keep 1–2 sentences) without losing
routing signal — the table harvest picks triggers from frontmatter at sync
time regardless of description length. Do the trim as its own task card.

## Undo

Restore the timestamped settings backup the installer prints, or delete the
four skill-hook entries from `hooks` in `~/.claude/settings.json`. Remove
`~/SaSMaster/hooks/` to drop the kit entirely.
