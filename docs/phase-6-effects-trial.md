# Phase 6 Effects Trial Design

## Purpose

Phase 6 is an Effects Trial / presentation experiment phase.

- This is **not** final polish.
- Run small reversible experiments.
- Keep PRs focused: **1 PR = 1 effect**.

## Absolute guardrails

During Phase 6 effect trials, do not change gameplay/balance systems:

- Do not change HP.
- Do not change damage.
- Do not change knockback.
- Do not change attack cooldown.
- Do not change attack duration.
- Do not change attack width/height.
- Do not change CPU behavior.
- Keep one-hit-per-attack.

Also do not add scope-expansion content:

- Do not add BGM/SE assets or playback.
- Do not add images, sprites, or 3D models.
- Do not add new fighters, specials, items, or equipment systems.
- Do not add rounds, timers, story, encyclopedia, online, or save systems.

## Current visual baseline (already implemented)

Treat these as existing baseline effects, not new Phase 6 features:

- Rectangle prototype visuals.
- Fighter body colors.
- Attack rectangles with fixed colors.
- Hit flash.
- `HIT -damage` marker.
- Match-end overlay.

Not implemented yet:

- Spark system.
- Screen shake.
- Win effect.
- Audio/asset-based feedback.

## Planned Phase 6 trial order

1. **Phase 6-1:** Effects trial design docs.
2. **Phase 6-2:** Attack visual variation.
3. **Phase 6-3:** Hit spark trial.
4. **Phase 6-4:** Impact marker / clean-hit label trial.
5. **Phase 6-5:** Small screen shake trial.
6. **Phase 6-6:** Win effect trial.
7. **Phase 6-7:** Phase 6 checkpoint docs.

## Character effect direction

- **Electric Guitar:** yellow/orange/white, sharp, short flashes, diagonal impact lines.
- **Bass:** blue/cyan/dark blue, heavy, thicker sparks, maybe tiny shake later.
- **Drum Sticks:** yellow/white/light orange, light, thin lines, small sparks, future clean-hit/critical-like candidate.
- **Keyboard:** purple/light purple/blue-purple, wide, waveform/band-like effects.

## Future hooks (document only, not implementation)

- Guard / just guard.
- Critical-like feedback.
- Combo-like labels.
- Direct / projectile / hybrid attack method classification.
- Amp/equipment ideas.
- Stamps/reactions.
- 3D conversion.
