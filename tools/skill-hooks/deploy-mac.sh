#!/bin/bash
# One-command deployer for the Mac: re-enable the 13 skills, install the
# skill-hooks kit, then verify everything landed.
#   bash deploy-mac.sh
set -euo pipefail

SETTINGS="$HOME/.claude/settings.json"
DEST="$HOME/SaSMaster/hooks"

say() { echo "[deploy-mac] $*"; }
fail() { say "FAIL: $*"; exit 1; }

REENABLE_JSON='["emil-design-eng","brainstorming","context-driven-development","ponytail","api-design-principles","parallel-debugging","parallel-feature-development","dispatching-parallel-agents","executing-plans","block-no-verify-hook","secrets-management","llm-evaluation","embedding-strategies"]'

# ---- STEP 1: re-enable skills (remove skillOverrides entries) ----
[ -f "$SETTINGS" ] || fail "no settings file at $SETTINGS"
jq empty "$SETTINGS" || fail "$SETTINGS does not parse; fix it before deploying"

BEFORE=$(jq '(.skillOverrides // {}) | length' "$SETTINGS")
REMOVED=$(jq -r --argjson names "$REENABLE_JSON" \
  '[(.skillOverrides // {}) | keys[] | select(. as $k | $names | index($k))] | join(", ")' "$SETTINGS")

BACKUP="$SETTINGS.pre-reenable.$(date +%Y%m%d-%H%M%S).bak"
cp "$SETTINGS" "$BACKUP"
say "settings backup -> $BACKUP"

TMP="$(mktemp)"
jq --argjson names "$REENABLE_JSON" '
  if .skillOverrides then
    .skillOverrides |= with_entries(select(.key as $k | ($names | index($k)) | not))
  else . end' "$SETTINGS" > "$TMP"
jq empty "$TMP"  # refuse to write a broken settings file
mv "$TMP" "$SETTINGS"

AFTER=$(jq '(.skillOverrides // {}) | length' "$SETTINGS")
say "skillOverrides entries: $BEFORE -> $AFTER"
say "re-enabled: ${REMOVED:-none (already enabled)}"

# ---- STEP 2: install the kit ----
bash "$(dirname "$0")/install.sh"

# ---- STEP 3: verify ----
say "verifying..."

LEFTOVER=$(jq -r --argjson names "$REENABLE_JSON" \
  '[(.skillOverrides // {}) | keys[] | select(. as $k | $names | index($k))] | join(", ")' "$SETTINGS")
[ -z "$LEFTOVER" ] || fail "still disabled in skillOverrides: $LEFTOVER"

[ -f "$DEST/routing-table.json" ] || fail "routing table missing at $DEST/routing-table.json"
SKILL_COUNT=$(jq '.skills | length' "$DEST/routing-table.json")
[ "$SKILL_COUNT" -gt 0 ] || fail "routing table has no skills"

jq empty "$SETTINGS" || fail "merged $SETTINGS does not parse"
HOOKS_WIRED=0
for cmd in session_start.py skill_router.py skill_gate.py skill_loaded_marker.py; do
  N=$(jq --arg c "$cmd" \
    '[.hooks // {} | .. | strings | select(contains($c))] | length' "$SETTINGS")
  [ "$N" -gt 0 ] || fail "hook command $cmd not wired in $SETTINGS"
  HOOKS_WIRED=$((HOOKS_WIRED + 1))
done

REENABLED_COUNT=$([ -z "$REMOVED" ] && echo 0 || echo "$REMOVED" | awk -F', ' '{print NF}')
cat <<EOF

DEPLOY OK
  skills re-enabled:    $REENABLED_COUNT
  routing table skills: $SKILL_COUNT
  hooks wired:          $HOOKS_WIRED/4
Restart your Claude Code session so the hooks register.
EOF
