# Caveman integration

Third-party token-optimization layer ([JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman),
100K+ stars, MIT/BSL-1.1 split license) installed as an **external tool**, not
vendored — no upstream source lives in this repo. Reviewed 2026-08-24: real
project (5,845 forks, 30 contributors, daily releases), self-published
benchmark claims 33.2% fewer provider input tokens on log/JSON/CSV-shaped
payloads (95% CI 14.6–48.5%, not independently reproducible — treat as an
upper bound, not a guarantee). Two other tools evaluated for this fold-in
(headroom, ponytail) are already covered by
`~/.claude/projects/-Users-shivashish/memory/project_headroom_codeburn_ponytail_eval_20260722.md`;
caveman is additive, not a replacement.

**Overlaps with `rtk`** (SaSMaster's own token-optimized CLI proxy, applied
via the global hook — see the `rtk` skill). Both intercept/compress traffic
at the CLI layer. Not yet reconciled — see Open questions below.

## What's installed

| Component | Where | Scope |
|---|---|---|
| `@caveman-ai/cli` (`caveman`, `cave` bins) | `devDependencies` in `package.json`, `node_modules/.bin/` | project-local |
| Go binaries (`caveman-proxy`, `caveman-engine`, `caveman-mcp`, `cavemem`, `caveman-browse`, `caveman-shrink`) | `~/.caveman/bin/` | machine-local, checksum-verified on install |
| Skill (caveman-speak + 19 companion skills: compress, learn, review, safe-refactor, etc.) | `.claude/skills/` | project-local (this repo only, via `npx skills add ... -a claude-code`) |
| `caveman learn` reports | `~/.caveman/reports/` | machine-local, read-only diagnostics |

Nothing was installed globally (no `claude plugin install`, no global npm
package, no edits to `~/.claude/settings.json` or `~/.claude.json`). Binaries
were fetched via `caveman setup --install` with per-binary checksum
verification (all six passed).

## Use

```bash
# terse-mode skill is now available in this repo's Claude Code sessions —
# invoked automatically or via "/caveman" / "talk like caveman"

# wrap Claude Code with the local compression proxy (127.0.0.1, BYOK,
# pass-through on any transform failure — see upstream proxy/README.md)
./node_modules/.bin/caveman claude

# re-run the token-sink diagnostic against local session history
./node_modules/.bin/caveman learn
./node_modules/.bin/caveman learn --all      # full 52-finding detail
./node_modules/.bin/caveman learn implement  # propose fixes as diffs, asks before each edit
```

## Licensing note

`proxy/`, `engine/`, `mcp/`, `shrink/`, and the `mem` Go core are BSL-1.1
upstream. We don't embed that source here — only the published, prebuilt
binaries and the MIT-licensed CLI/skill layer. BSL's Additional Use Grant
permits first-party self-hosted production use (our case); a commercial
license would only be needed if SaSMaster re-offered Caveman's functionality
as a hosted/managed service to third parties, which is out of scope.

## Open questions / follow-ups

- **rtk overlap**: decide whether `caveman claude` wrap and rtk's hook-level
  interception coexist cleanly or double-compress/conflict. Untested.
- **Skill vs. reporting style**: the caveman-speak skill's terse output
  conflicts with Shiv's stated "radical transparency, no hedging, detailed"
  reporting preference — installed but not enabled by default; opt in
  per-session with `/caveman` rather than always-on.
- **Benchmark not independently reproduced** — before leaning on the 33.2%
  number for any external claim (pitch deck, investor doc), re-measure
  against actual SaSMaster log/JSON payloads with `caveman claude` wrap on.
