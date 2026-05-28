# Phase 11: UI Layout Rework (Japanese Layout First)

## Purpose

Phase 11 improves **Japanese UI layout quality** without changing gameplay systems.

Slogan:

> Do not shrink text just to cram it in. Use the screen more broadly.

This phase focuses on overflow, overlap, cramped spacing, and weak information hierarchy in Japanese text-heavy UI.

## Scope

Phase 11 is a UI layout/readability phase.

- Primary target language: Japanese UI.
- Primary problem types: text overflow, overlap, cramped cards/rows, weak spacing hierarchy.
- Primary target screens:
  1. `RecordsScene`
  2. `CharacterSelectScene`
  3. `BattleScene` HUD

## Known UI layout issues (starting list)

- `RecordsScene`
  - Dense rows and labels can overlap or feel cramped in Japanese.
  - Information hierarchy (headline vs value vs note) is not consistently clear.
- `CharacterSelectScene`
  - Card width and content density can force long Japanese strings into cramped space.
  - Status/stat text can overflow or compete visually with selection info.
- `BattleScene` HUD
  - Japanese instruction/help text can crowd core combat HUD space.
  - Simultaneous labels can reduce glance readability during active play.

These issues should be handled in small, focused PRs with manual play checks.

## Priority order

1. `RecordsScene`
2. `CharacterSelectScene`
3. `BattleScene` HUD
4. Other screens after the core three are stable

## Recommended implementation order

1. **11-1** Phase 11 scope docs / known UI issues and non-goals
2. **11-2** `RecordsScene` overlap fix
3. **11-3** `RecordsScene` hierarchy cleanup
4. **11-4A** Viewport-aware layout foundation before Character Select layout work
5. **11-4** Character Select card width/layout rework
6. **11-5** Character Select text wrap/status overflow fix
7. **11-6** Character Select information hierarchy cleanup
8. **11-7** Battle HUD layout rework
9. **11-8** Battle instruction reduction
10. **11-9** Pause / Quick Help Japanese layout fix
11. **11-10** Equipment Select layout review
12. **11-11** ResultScene layout review
13. **11-12** OptionsScene layout review
14. **11-13** Home / Mode Select final layout pass
15. **11-14** Shared UI spacing constants review (only if useful)
16. **11-15** Japanese UI manual playtest checklist update
17. **11-16** Phase 11 checkpoint docs

## Strict non-goals

Phase 11 must **not** change gameplay/balance systems.

- Do not change HP, damage, knockback, attack cooldown, attack duration, attack speed.
- Do not change hitbox, hurtbox, CPU behavior, fighter stats.
- Do not change equipment effects or compatibility.
- Do not change records schema or settings schema.
- Do not implement Guard, Just Guard, Timer, Round rules, Retire, Pick effects.
- Do not make attack tempo changes or hitbox tuning.
- Do not add new fighters, online play, 3D, large assets, pedal equipment, audio, images, or external assets.

## Guardrails

- Keep PRs small: ideally **1 PR = 1 screen** or **1 focused issue**.
- Prefer layout structure improvements over font-size shrinking.
- Keep existing scene flow and control scheme unless a Phase 11 task explicitly requires UI-only text/layout adjustment.
- If a UI issue suggests gameplay changes, defer it to a later gameplay-focused phase.

## Review and PR rules

- 11-1 is docs-first; do not bundle runtime UI rewrites into 11-1.
- PR title/body may be broad, but reviewers should prioritize:
  - changed files,
  - actual diff,
  - main branch reality,
  - runtime behavior.
- Keep each PR focused and easy to verify manually.

## Verification expectations

For each Phase 11 task PR:

1. Run `npm run build` if possible.
2. If build is not possible, explain why.
3. Verify docs/task scope still clearly states:
   - Phase 11 purpose,
   - known issues,
   - task order,
   - non-goals,
   - guardrails.
4. For runtime UI tasks, do manual Japanese readability checks at practical play resolution.

## v1.0 alignment

- Phase 20 remains the target for v1.0.
- Until v1.0, keep avoiding large-scope expansions (new fighters, online features, 3D, large assets, pedal equipment).
