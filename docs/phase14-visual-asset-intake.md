# Phase 14 Visual Asset Intake

This note defines where manually supplied Phase 14 visual PNG assets should be placed before Codex implementation work.

## Directories already scaffolded

- `public/assets/images/effects/attack/`
- `public/assets/images/effects/guard/`
- `public/assets/images/effects/just_guard/`

## Manual asset rule

The PNG files themselves are supplied manually, not by Codex. Codex should only preload and use files that already exist.

## Implementation guardrails

Do not change gameplay values, storage schema, fighter stats, timers, guard rules, or collision values during visual intake.

## Background expansion status

- BattleScene now preloads three manually supplied background PNGs: music studio, live house, and summer festival.
- BattleScene selects one available preloaded background at match start; no background selection UI is implemented yet.
- The existing cover-style scaling and dark readability overlay are kept so fighters, UI, and attack effects remain visible.

## Remaining background work

- Tune per-background brightness/overlay values after visual playtest.
- Revisit effect scale/readability against each background only if a specific background causes clarity issues.
- Add a compact background selection UI later if/when selecting arenas becomes part of the MVP scope.
