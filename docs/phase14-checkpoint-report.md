# Phase 14 Checkpoint: Combat Visualization / Fighter Presentation / Background & Fullscreen

Phase 14 is closed as a visual-readability checkpoint. It added manually supplied visual assets to BattleScene, verified that the current combat state can be read through base fighter sprites plus short-lived effects, and records fullscreen / viewport work as a known follow-up rather than a Phase 14 blocker.

This checkpoint is documentation-only. It does not change runtime behavior, gameplay values, UI flow, records/settings schema, audio, or image assets.

## Completed Phase 14 work

- **4 fighter base sprites** are available for the current roster and are used as the primary fighter presentation layer.
- **Attack effects** are shown during attack startup/active presentation so attack direction is easier to read.
- **Hit effects** are shown on successful hit feedback.
- **Guard effects** are shown during normal Guard.
- **Just Guard effects** are visually distinct from normal Guard.
- **Critical effects** are shown for critical hit feedback.
- **3 BattleScene backgrounds** are supported:
  - `bg_music_studio_pixel.png`
  - `bg_live_house_pixel.png`
  - `bg_summer_festival_pixel.png`
- **BattleScene visual integration** is in place for base fighter sprites, battle backgrounds, and attack / hit / guard / just guard / critical effects.
- **Background random selection** is used during normal play.
- **Development-only background cycling** is available for checking backgrounds without adding a normal player-facing selection UI.
- **Fullscreen / responsive viewport support** has an initial implementation for BattleScene background and HUD layout behavior.

## Phase 14 completion decision

Phase 14 is treated as complete for the MVP visual-readability target because:

- Attacks, hits, normal Guard, Just Guard, and Critical feedback are visually distinguishable during battle.
- The four current fighters can be presented with base sprites without requiring attack / guard / hit sprite variants.
- Three backgrounds can be used in BattleScene.
- Normal play keeps background selection random.
- Development checks can cycle backgrounds through debug-only controls.

## Frozen / deferred within Phase 14

The following are intentionally not pursued further in Phase 14:

- Fullscreen / viewport stabilization beyond the current trial implementation.
- Fine-grained brightness or overlay tuning per background.
- Fine-grained effect scale, alpha, or duration tuning.
- Attack / Guard / Hit fighter sprite variants.
- Final title logo direction or Home / Title visual presentation.
- Player-facing background selection UI.

## Fullscreen / viewport note

Fullscreen / viewport support is **implemented as a trial**, but it is not considered final.

Current handling:

- BattleScene has fullscreen / resize support in place.
- Background cover-style scaling and HUD repositioning exist.
- Wide viewport and fullscreen behavior are expected to be good enough for checkpoint closure.

Known freeze decision:

- There may still be bugs or mismatches with the final intended fullscreen presentation.
- Phase 14 will not chase those issues further.
- Fullscreen / viewport stabilization should become a dedicated later-phase task if it remains important.

## Fighter sprite variant note

Phase 14 does **not** add attack / guard / hit sprite variants.

Rationale:

- Current combat readability is sufficient with base sprites plus visual effects.
- Adding variants for every fighter and state would increase asset and implementation management cost.
- Variants should be reconsidered only after a later playtest identifies a clear readability or presentation need.

## Systems intentionally unchanged

Phase 14 intentionally does **not** change:

- AttackTiming values.
- Hitbox values or hitbox behavior.
- Pick behavior.
- Guard / Just Guard behavior or numeric values.
- Timer behavior.
- Retire / Forfeit behavior.
- Result reason behavior.
- Damage values.
- Knockback values.
- Move speed values.
- Fighter stats.
- Records schema.
- Settings schema.
- LocalStorage keys or data shape.
- SE / BGM.
- Fighter roster.
- Online play.
- 3D conversion.

## Next phase candidates

Possible next directions:

- **Result Flow / Rematch / Navigation Polish**: tighten the post-match loop and navigation clarity.
- **Home / Title presentation polish**: improve first impression without changing battle rules.
- **Fullscreen / viewport stabilization**: make fullscreen and resize behavior production-stable.
- **Visual tuning pass if needed**: tune background brightness or effect readability after focused playtest.

## Checkpoint status

Phase 14 is checkpointed and visually frozen for now. Future work should treat fullscreen, viewport stability, fine visual tuning, sprite variants, and player-facing background selection as separate scoped tasks rather than continuing Phase 14 implementation.
