#!/bin/bash
# Install the SaSMaster skill-hooks kit on the Mac.
#   bash install.sh              -> installs to ~/SaSMaster/hooks, merges settings
#   bash install.sh --dry-run    -> shows what would happen, writes nothing
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/SaSMaster/hooks"
SETTINGS="$HOME/.claude/settings.json"
DRY=0
[ "${1:-}" = "--dry-run" ] && DRY=1

say() { echo "[skill-hooks] $*"; }

# Canonical skills dir first so it wins on name collisions.
SKILL_DIRS=()
[ -d "$HOME/.claude/skills/user" ] && SKILL_DIRS+=(--skills-dir "$HOME/.claude/skills/user")
[ -d "$HOME/.claude/skills" ] && SKILL_DIRS+=(--skills-dir "$HOME/.claude/skills")
if [ ${#SKILL_DIRS[@]} -eq 0 ]; then
  say "ERROR: no skills directory found under ~/.claude — nothing to route to."
  exit 1
fi

if [ "$DRY" = 1 ]; then
  say "would copy kit -> $DEST"
  say "would generate $DEST/routing-table.json from: ${SKILL_DIRS[*]}"
  say "would merge settings-hooks.json into $SETTINGS (backup first)"
  exit 0
fi

mkdir -p "$DEST" "$HOME/SaSMaster/logs"
cp "$SRC"/generate_routing_table.py "$SRC"/skill_router.py "$SRC"/skill_gate.py \
   "$SRC"/skill_loaded_marker.py "$SRC"/session_start.py "$SRC"/routing_report.py \
   "$SRC"/routing-overrides.json "$SRC"/settings-hooks.json "$DEST/"
chmod +x "$DEST"/*.py
say "kit copied -> $DEST"

python3 "$DEST/generate_routing_table.py" "${SKILL_DIRS[@]}" \
  --overrides "$DEST/routing-overrides.json" --out "$DEST/routing-table.json"

# Merge hooks into user settings: append our entries per event, never replace.
if [ ! -f "$SETTINGS" ]; then echo '{}' > "$SETTINGS"; fi
BACKUP="$SETTINGS.pre-skill-hooks.$(date +%Y%m%d-%H%M%S).bak"
cp "$SETTINGS" "$BACKUP"
TMP="$(mktemp)"
jq --slurpfile add "$DEST/settings-hooks.json" '
  .hooks = (.hooks // {}) |
  reduce ($add[0].hooks | to_entries[]) as $e (
    .;
    .hooks[$e.key] = ((.hooks[$e.key] // []) + $e.value)
  )' "$SETTINGS" > "$TMP"
jq empty "$TMP"  # refuse to install a broken settings file
mv "$TMP" "$SETTINGS"
say "hooks merged into $SETTINGS (backup: $BACKUP)"

say "smoke test:"
echo '{"prompt":"is the nielsen amrld data fresh or stale?","session_id":"install-test"}' \
  | python3 "$DEST/skill_router.py" "$DEST/routing-table.json" || true

cat <<EOF

DONE. Finish with these manual steps:

1. Add table regen to sync_skills.sh (after the derivative regen step):
     python3 \$HOME/SaSMaster/hooks/generate_routing_table.py \\
       --skills-dir \$HOME/.claude/skills/user --skills-dir \$HOME/.claude/skills \\
       --overrides \$HOME/SaSMaster/hooks/routing-overrides.json \\
       --out \$HOME/SaSMaster/hooks/routing-table.json

2. Cron (suggested — table regen nightly 04:45 after the 04:40 skill sync;
   accuracy report Sunday 07:00):
     45 4 * * * python3 \$HOME/SaSMaster/hooks/generate_routing_table.py --skills-dir \$HOME/.claude/skills/user --skills-dir \$HOME/.claude/skills --overrides \$HOME/SaSMaster/hooks/routing-overrides.json --out \$HOME/SaSMaster/hooks/routing-table.json
     0 7 * * 0 python3 \$HOME/SaSMaster/hooks/routing_report.py --since 7

3. Restart your Claude Code session so the hooks register.

UNDO: restore the backup shown above over $SETTINGS, or delete the four
skill-hook entries from its "hooks" key. The kit itself is just files in
$DEST — removing the dir removes everything else.
EOF
