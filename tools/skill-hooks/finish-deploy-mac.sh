#!/bin/bash
# Finish the skill-hooks deploy on the Mac: wire sync_skills.sh + cron.
# Idempotent — safe to run twice. Run AFTER deploy-mac.sh.
set -euo pipefail

say() { echo "[finish-deploy] $*"; }
fail() { echo "[finish-deploy] ERROR: $*" >&2; exit 1; }

HOOKS="$HOME/SaSMaster/hooks"
[ -f "$HOOKS/generate_routing_table.py" ] || fail "kit not found at $HOOKS — run deploy-mac.sh first"

REGEN_CMD="python3 \$HOME/SaSMaster/hooks/generate_routing_table.py --skills-dir \$HOME/.claude/skills/user --skills-dir \$HOME/.claude/skills --overrides \$HOME/SaSMaster/hooks/routing-overrides.json --out \$HOME/SaSMaster/hooks/routing-table.json"
REPORT_CMD="python3 \$HOME/SaSMaster/hooks/routing_report.py --since 7"

# --- 1. sync_skills.sh: append regen step (runs after everything else in the script)
SYNC="$HOME/SaSMaster/scripts/sync_skills.sh"
if [ ! -f "$SYNC" ]; then
  SYNC="$(find "$HOME/SaSMaster" -maxdepth 3 -name sync_skills.sh 2>/dev/null | head -1)"
fi
if [ -z "${SYNC:-}" ] || [ ! -f "$SYNC" ]; then
  say "WARN: sync_skills.sh not found under ~/SaSMaster — skipping step 1 (cron regen below still covers nightly freshness)"
elif grep -q "generate_routing_table.py" "$SYNC"; then
  say "sync_skills.sh already wired — skipping"
else
  cp "$SYNC" "$SYNC.pre-skill-hooks.$(date +%Y%m%d-%H%M%S).bak"
  cat >> "$SYNC" <<EOF

# SKILL-HOOKS: regenerate the deterministic routing table after every skill
# sync so the router never drifts from the canonical skills. (finish-deploy-mac.sh)
$REGEN_CMD || echo "[sync_skills] WARN: routing-table regen failed — router will use the previous table"
EOF
  say "regen step appended to $SYNC (backup written next to it)"
fi

# --- 2. cron: nightly table regen 04:45 (after 04:40 skill sync) + Sunday 07:00 report
CRON_ERR="$(mktemp)"
if CRON_NOW="$(crontab -l 2>"$CRON_ERR")"; then
  :
elif grep -qi "no crontab for" "$CRON_ERR"; then
  CRON_NOW=""
else
  fail "crontab -l failed unexpectedly ($(cat "$CRON_ERR")) — not proceeding, crontab left untouched"
fi
rm -f "$CRON_ERR"
CRON_NEW="$CRON_NOW"
if ! grep -q "generate_routing_table.py" <<< "$CRON_NOW"; then
  CRON_NEW="$CRON_NEW
45 4 * * * $REGEN_CMD
"
  say "adding nightly 04:45 routing-table regen to crontab"
else
  say "crontab already has table regen — skipping"
fi
if ! grep -q "routing_report.py" <<< "$CRON_NOW"; then
  CRON_NEW="$CRON_NEW
0 7 * * 0 $REPORT_CMD
"
  say "adding Sunday 07:00 accuracy report to crontab"
else
  say "crontab already has accuracy report — skipping"
fi
if [ "$CRON_NEW" != "$CRON_NOW" ]; then
  CRON_BAK="$HOME/SaSMaster/crontab.pre-skill-hooks.$(date +%Y%m%d-%H%M%S).bak"
  printf '%s\n' "$CRON_NOW" > "$CRON_BAK"
  say "crontab backed up to $CRON_BAK"
  printf '%s\n' "$CRON_NEW" | grep -v '^[[:space:]]*$' | crontab - || fail "crontab install failed — crontab unchanged"
  say "crontab updated"
fi

# --- 3. verify
grep -q "generate_routing_table.py" <<< "$(crontab -l 2>/dev/null)" || fail "verify: regen cron missing"
grep -q "routing_report.py" <<< "$(crontab -l 2>/dev/null)" || fail "verify: report cron missing"
echo
echo "FINISH OK"
[ -n "${SYNC:-}" ] && [ -f "$SYNC" ] && grep -q generate_routing_table.py "$SYNC" \
  && echo "  sync_skills.sh: wired ($SYNC)" || echo "  sync_skills.sh: NOT wired (see WARN above)"
echo "  cron: $(crontab -l | grep -c 'SaSMaster/hooks') skill-hooks entries"
echo "Last step: restart your Claude Code session so the hooks register."
