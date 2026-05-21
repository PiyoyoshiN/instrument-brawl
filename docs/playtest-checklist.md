# Playtest Checklist (Phase 5)

Use this short checklist before merging gameplay-adjacent PRs.

## Core flow and roster

- [ ] Home -> Character Select -> Battle -> Result flow works.
- [ ] Four selectable fighters are available: Electric Guitar, Bass, Drum Sticks, Keyboard.
- [ ] Local 2P remains the default mode.

## P2 mode behavior (Human / CPU)

- [ ] Character Select can toggle P2 mode (Human/CPU).
- [ ] Selected P2 mode is preserved through BattleScene.
- [ ] Selected P2 mode is preserved in ResultScene.
- [ ] `R` rematch preserves fighters and P2 mode.
- [ ] `C` return-to-character-select preserves fighters and P2 mode.
- [ ] Human vs Human battle still works.
- [ ] P1 vs CPU battle still works.
- [ ] CPU does not act before `Fight`.

## Pause / Quick Help (BattleScene)

- [ ] `P` opens Pause / Quick Help.
- [ ] `P` closes Pause / Quick Help (resume).
- [ ] Overlay shows compact controls and current P2 mode.
- [ ] While paused: movement stops.
- [ ] While paused: new attacks do not start.
- [ ] While paused: CPU behavior stops.
- [ ] While paused: active attack updates stop.
- [ ] While paused: knockback updates stop.
- [ ] Pausing near match start does not break Ready / Fight.
- [ ] CPU does not act while paused.

## ResultScene behavior

- [ ] ResultScene supports `R` rematch.
- [ ] ResultScene supports `C` character select return.
- [ ] ResultScene supports `Enter` / `Space` return Home.
- [ ] Win text and Draw text display naturally.

## Regression guardrails

- [ ] One attack can hit only once.
- [ ] `matchOver` prevents extra damage and duplicate transitions.
- [ ] No new fighters/specials/items/progression/story/encyclopedia were added.
- [ ] No timer/rounds/retire/settings/tutorial/practice/save/online were added.
- [ ] No BGM/SE assets, images, or sprites were added.


## Phase 6 note

- [ ] Effects trial PRs follow `docs/phase-6-effects-trial.md` guardrails and keep gameplay values unchanged.


## Phase 6 effects checklist

- [ ] Attack color variation appears by fighter.
- [ ] Hit spark appears on confirmed hit.
- [ ] `HIT -damage` and `CLEAN HIT` appear on confirmed hit.
- [ ] Tiny shake appears on hit and not on miss.
- [ ] Win/draw effect appears only when match ends.
- [ ] No assets/audio were added for effects.
- [ ] `P` pause, `R` rematch, and `C` return-to-character-select still work.


## Phase 7 planning checklist

- [ ] Phase 7 docs keep Home / Mode Select / Options and local save as planning scope only.
- [ ] Existing CharacterSelectScene P2 Human/CPU toggle is kept as current behavior.
- [ ] No gameplay values/logic changes are introduced during planning-only PRs.
- [ ] No audio/assets or online/server-saving implementation is introduced in planning-only PRs.
