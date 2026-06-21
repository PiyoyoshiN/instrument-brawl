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

## Fullscreen / viewport support status

- BattleScene supports fullscreen toggle with the `F` key and keeps the random background selection behavior for normal play.
- The selected battle background is re-laid out with the same cover-style scaling on resize/fullscreen changes, with the dark readability overlay resized with the viewport.
- Development-only background cycling is available with `B` while hitbox debug is enabled; it is not shown as a normal player-facing selection UI and is not saved.
- HUD text, HP bars, timer text, pause overlay, and match-over title are repositioned on resize to reduce wide/fullscreen viewport clipping.

## Remaining fullscreen / viewport work

- Fine-tune brightness per background after fullscreen playtests.
- Recheck effect scale/readability only where a specific viewport/background combination needs it.
- Consider a future background selection UI only if it becomes part of the MVP scope.

## Checkpoint reference

Phase 14 is checkpointed in `docs/phase14-checkpoint-report.md`. Further fullscreen, viewport, brightness, effect tuning, sprite variant, or player-facing background selection work should be scoped as later-phase tasks.
