# Playtest Checklist (Phase 5)

Use this short checklist before merging gameplay-adjacent PRs.

## Core flow and roster

- [ ] Home -> Mode Select -> Character Select -> Battle -> Result flow works.
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
- [ ] Docs define one namespaced localStorage key (`instrument-brawl:settings`) with a versioned JSON payload plan.
- [ ] Docs list planned fields: last selected P1 fighter, last selected P2 fighter, last selected P2 mode, effects enabled, screen shake enabled.
- [ ] Docs describe fallback behavior for unavailable storage, parse failure, invalid fighter IDs, and invalid player2Mode (`human` fallback).
- [ ] Docs explicitly keep save/load as future implementation only (no runtime code changes in this PR).
- [ ] Utility helpers exist for load/save/sanitize with safe localStorage try/catch fallback behavior.
- [ ] Confirmed selections are saved to localStorage on Mode Select confirm and Character Select battle start.
- [ ] Saved values are restored to initial Mode Select / Character Select UI state after reload.
- [ ] Character Select uses ModeSelectScene-provided P2 mode over stored P2 mode when provided.
- [ ] Existing CharacterSelectScene P2 Human/CPU toggle is kept as current behavior.
- [ ] No gameplay values/logic changes are introduced during planning-only PRs.
- [ ] No audio/assets or online/server-saving implementation is introduced in planning-only PRs.
- [ ] Docs explicitly define future Options scope as only Effects ON/OFF and Screen Shake ON/OFF preferences.
- [ ] Docs map Options preferences to `preferences.effectsEnabled` and `preferences.screenShakeEnabled` defaults (`true`/`true`).
- [ ] Docs state Options implementation/wiring is future scope; no scene/UI behavior changes in this docs-only step.
- [ ] Docs state Effects OFF is visual-only (no gameplay logic/value changes) and Screen Shake OFF affects only tiny shake.
- [ ] Docs keep BGM/SE settings and Records preferences out of current Options scope.
- [ ] Docs define Records as a future lightweight local-only foundation (planning-only in this phase step).
- [ ] Docs keep Records separate from settings storage direction (`instrument-brawl:records` suggested, `instrument-brawl:settings` unchanged).
- [ ] Docs list lightweight candidate counters only (matches/wins/draws/mode split/lastPlayedAt).
- [ ] Docs explicitly exclude achievements/unlocks/story/online/account/deep analytics/replay tracking from current Records scope.


## Options behavior checks

- [ ] Home -> Options opens OptionsScene.
- [ ] Options Esc returns Home.
- [ ] Options can toggle/save Effects ON/OFF and Screen Shake ON/OFF.
- [ ] Reload + reopen Options reflects saved preference values.
- [ ] Effects OFF hides nonessential visual extras (hit spark / CLEAN HIT sub-label / win-draw accent effects).
- [ ] Screen Shake OFF disables tiny shake only.
- [ ] Gameplay logic/values remain unchanged by these options.

## Mode Select behavior checks

- [ ] Home Enter/Space opens Mode Select.
- [ ] Mode Select shows two vertical choices: VS HUMAN (Local 2P) and VS CPU (P1 vs CPU).
- [ ] Clicking/tapping Local 2P opens Character Select with P2 Mode: Human.
- [ ] Clicking/tapping P1 vs CPU opens Character Select with P2 Mode: CPU.
- [ ] Keyboard highlight moves between the two choices.
- [ ] Enter/Space confirms the highlighted choice.
- [ ] Character Select P2 Down still toggles Human/CPU.
- [ ] Battle receives selected P2 mode.
- [ ] Result `R` rematch preserves P2 mode.
- [ ] Result `C` return-to-character-select preserves P2 mode.
- [ ] Escape from Mode Select returns Home.

## Phase 7 scene-flow planning checklist

- [ ] Docs clearly separate current flow (`Home -> Character Select -> Battle -> Result`) from target Phase 7 flow (`Home -> Mode Select -> Character Select -> Battle -> Result`).
- [ ] Docs reflect ModeSelectScene as implemented and keep OptionsScene/localStorage/Records as future scope (not implemented yet).
- [ ] Mode Select mapping docs are explicit: Local 2P -> `player2Mode: "human"`, P1 vs CPU -> `player2Mode: "cpu"` via two visible choices.
- [ ] Docs state ModeSelectScene starts CharacterSelectScene with `{ player2Mode }`.
- [ ] Docs state Home Start goes to ModeSelectScene.
- [ ] Existing CharacterSelect P2 Human/CPU toggle is retained as current fallback/manual override.
- [ ] Existing Battle/Result data handoff expectations (fighters + P2 mode) remain documented.
