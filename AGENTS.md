# SaSMaster Platform — Agent & Developer Rules

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo 2.x + Bun workspace |
| Framework | Next.js 15 App Router (apps/portal) |
| Language | TypeScript 5.7 — `strict: true`, zero `any` tolerance |
| Styling | Tailwind v4 CSS-first (`@theme` in packages/tokens) |
| Components | shadcn/ui primitives + SaSMaster custom (packages/ui) |
| Charts | Highcharts 12 (commercial), Recharts/nivo (OSS), amCharts5 (Sankey/stream) |
| Testing | Vitest (unit), Storybook 8 (visual) |

## Design Tokens

All tokens live in `packages/tokens/src/index.css`. Never hardcode hex values in components.

### Dark Cinematic (portal)
```
--color-bg-base: #0a0a0f
--color-bg-surface: #13131a
--color-bg-elevated: #1a1a24
--color-brand-lavender: #a78bfa   ← primary action, nav active, ring
--color-brand-teal: #22d3ee       ← section underline, accent
--color-brand-gold: #f59e0b       ← KPI label, metric accent
--color-brand-coral: #f87171      ← destructive, alert
--color-brand-green: #34d399      ← positive delta
```

### Light Operational (War Room / analytics)
```
--color-canvas: #f0f4f8
--color-surface: #ffffff
--color-teal-500: #0ea5e9
```

### SIGNAL COLOR RULES — semantics are FIXED, never override
```
teal   (#0ea5e9) = live data / primary action / positive trend
orange (#fb923c) = chart accent / prior year overlay / pricing alert
green  (#10b981) = positive delta / LIVE dot / score ring
red    (#ef4444) = negative delta / restrictions / alerts
purple (#8b5cf6) = audience data / TUT / demographic breakdown
```

## Font Rules

Context determines the font — never mix stacks within one context:

**Dark Cinematic**
- `--font-display` (Bebas Neue) → hero headlines only
- `--font-heading` (Barlow Condensed) → section titles, nav labels, card labels
- `--font-mono-sasmster` (Share Tech Mono) → monospace data

**Light Operational**
- `--font-display-light` (Space Grotesk) → hero/section titles
- `--font-body` (Inter) → body text, labels, UI text
- `--font-data` (JetBrains Mono) → data readouts, deltas, IDs, axis labels **ONLY**

## Visualization Library Selection

```
Highcharts (commercial license 100033385101500)
  → time series, stock/financial charts, advanced cartesian viz
  → ALWAYS 'use client'
  → import via @sasmaster/ui charts

Recharts / nivo
  → standard bar/line/area in React server components

amCharts5
  → Sankey diagrams, stream charts, chord diagrams, complex flows
```

## Component Rules

1. **Always** import from `@sasmaster/ui` — never write inline one-off components for primitives
2. **Never** write inline Tailwind classes that duplicate a token — use the CSS var directly
3. **Never** hardcode colors, font names, or radius values in components
4. Use `cn()` from `@sasmaster/ui` for conditional class merging
5. All Highcharts components **must** have `'use client'` at the top
6. Every new component in `packages/ui` **requires** a Storybook story in `packages/ui/src/stories/`

## File Structure Conventions

```
apps/portal/src/
  app/
    (portal)/        ← route group for authenticated portal layout
      content/       ← Content Analytics section
      advertising/   ← Advertising Intelligence section
      marketing/     ← Marketing Analytics section
      cpg/           ← CPG Intelligence section
      exchange/      ← Exchange section
    layout.tsx       ← root layout (fonts, globals.css)
    page.tsx         ← redirects to /content
  components/        ← portal-specific components (not shared)
```

## TypeScript Rules

- `strict: true` — no exceptions
- Zero `any` — use `unknown` + type narrowing
- `noUncheckedIndexedAccess: true` — always check array access
- Prefer `type` imports: `import type { Foo } from 'bar'`
- Use `satisfies` for config objects

## Routing

- App Router only — **do not create Pages Router files**
- Use route groups `(name)` for layout inheritance without URL segments
- Server Components by default; add `'use client'` only when needed (event handlers, hooks, Highcharts)

## Pre-commit Gates

Commits are blocked if:
1. TypeScript has errors (`turbo typecheck`)
2. ESLint fails (`turbo lint`) — `@typescript-eslint/no-explicit-any` is `error`
3. Build fails (`turbo build`)

## Highcharts License

License ID: `100033385101500`  
Store in `.env.local` as `NEXT_PUBLIC_HIGHCHARTS_LICENSE_ID`.  
Never hardcode in source files. Never commit `.env.local`.
