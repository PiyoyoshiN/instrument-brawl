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

## Manual playtest checklist

- Phase 11 Japanese UI layout playtest coverage is tracked in `docs/playtest-checklist.md` under `Phase 11-15 Japanese UI layout playtest checklist`.
- Use that checklist before the Phase 11 checkpoint docs and for follow-up manual Japanese readability passes.

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


## Phase 11 checkpoint summary

Phase 11 can be treated as checkpoint-ready after the Phase 11 Japanese UI manual playtest checklist has been run.

Completed checkpoint scope:

- `RecordsScene` layout/readability improvements for records summary, last played text, reset confirmation, and lower controls.
- Viewport-aware layout foundation so later UI screens can use actual canvas/layout width and height instead of staying trapped in an 800x600-centered island.
- `CharacterSelectScene` card width/layout rework, text wrapping/status overflow fixes, and information hierarchy cleanup.
- `CharacterSelectScene` regression fix after the UI rendered huge near the upper-left and clipped offscreen.
- `BattleScene` HUD layout work, HUD visibility regression fix, and battle instruction reduction.
- Pause / Quick Help Japanese layout fix so detailed controls are readable in the overlay instead of always visible in the battle HUD.
- `EquipmentSelectScene`, `ResultScene`, `OptionsScene`, `HomeScene`, and `ModeSelectScene` layout/readability reviews.
- Shared UI spacing constants review to lightly centralize obvious repeated spacing values.
- Phase 11 Japanese UI manual playtest checklist update.

Important regression guardrails for future viewport/layout work:

- `CharacterSelectScene` previously had an upper-left huge/clipped display regression. Future layout work must confirm title, P1/P2 cards, descriptions, stats, and footer remain inside the visible canvas.
- `BattleScene` HUD / HP bars previously disappeared after HUD layout work. Future HUD or viewport work must confirm P1/P2 HP bars, equipment labels, and bottom instructions remain visible.

Known deferred issues:

- `ResultScene` has a visual bug noticed by the user and is intentionally deferred for later full-screen/global layout cleanup.
- Battle HUD visual style is visible and functional for now, but polish may be revisited later after Timer/Round/Guard or other systems clarify HUD needs.
- Any future full-screen/global layout cleanup should consider `ResultScene` and Battle HUD polish together rather than mixing them into unrelated UI PRs.

Non-goals confirmed at checkpoint:

- No Guard or Just Guard.
- No Timer, Round rules, or Retire.
- No Pick effects.
- No attack tempo changes or hitbox tuning.
- No fighter stat changes.
- No equipment effect or compatibility changes.
- No records/settings schema changes.
- No new fighters, online play, 3D, audio, images, or external assets.

Manual verification reminder:

- Use `docs/playtest-checklist.md` under `Phase 11-15 Japanese UI layout playtest checklist`.
- Check at 800x600, a laptop-sized viewport, and a large desktop viewport.
- Cover Home, Mode Select, Character Select, Equipment Select, Battle HUD, Pause / Quick Help, Result, Records, and Options.

Recommended next direction:

- If manual playtest is acceptable, Phase 11 can be checkpointed and the project can proceed to the next planned gameplay/system phase.
- If UI instability remains, address deferred global/full-screen layout cleanup in a focused follow-up before starting new gameplay work.
- Do not start new gameplay features inside Phase 11 checkpoint documentation PRs.

## v1.0 alignment

- Phase 20 remains the target for v1.0.
- Until v1.0, keep avoiding large-scope expansions (new fighters, online features, 3D, large assets, pedal equipment).
