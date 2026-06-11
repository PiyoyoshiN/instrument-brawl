# Fighter Image Asset Inventory

## Current accepted fighter image files

| File | Intended use | Runtime status |
| --- | --- | --- |
| `public/assets/images/fighters/fighter_keyboard_base.png` | Keyboard base fighter sprite | Asset only, not wired yet |
| `public/assets/images/fighters/fighter_drum_sticks_base.png` | Drum Sticks base fighter sprite | Asset only, not wired yet |
| `public/assets/images/fighters/fighter_bass_base.png` | Bass base fighter sprite | Asset only, not wired yet |
| `public/assets/images/fighters/fighter_electric_guitar_base.png` | Electric Guitar base fighter sprite | Asset only, not wired yet |

## Notes

- These files are intended as v1.0 temporary/base fighter sprites.
- This inventory accepts the image asset paths only; runtime rendering may be implemented in a later PR.
- The image files should be PNG files suitable for in-game rendering.
- Prefer true transparent PNG files. Do not use checkerboard-background images as final runtime assets.
- Keep the current fighter IDs unchanged: `keyboard`, `drum-sticks`, `bass`, `electric-guitar`.
- Do not add new fighters in this image asset pass.
- Do not change AttackTiming, hitboxes, Pick, Guard, Just Guard, Timer, Retire, Result reason, records schema, or settings schema.

## Implementation handoff

When wiring these images into the game, the implementation should:

- Preload the four PNG files from `assets/images/fighters/...`.
- Display them as fighter visuals in BattleScene without changing gameplay values.
- Keep existing hitboxes and movement logic intact.
- Use scaling/rotation/positioning only for visual presentation.
- Keep fallback behavior so missing image assets do not crash gameplay.
