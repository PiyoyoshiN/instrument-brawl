# Playtest Checklist (Phase 7 checkpoint)

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


## Phase 7 checkpoint checklist

- [ ] Phase 7 checkpoint is documented as complete (game shell + mode select + options + localStorage settings + records foundation docs).
- [ ] Docs define one namespaced localStorage key (`instrument-brawl:settings`) with a versioned JSON payload plan.
- [ ] Docs list planned fields: last selected P1 fighter, last selected P2 fighter, last selected P2 mode, effects enabled, screen shake enabled.
- [ ] Docs describe fallback behavior for unavailable storage, parse failure, invalid fighter IDs, and invalid player2Mode (`human` fallback).
- [ ] Docs state Records runtime, RecordsScene, and Home Records wiring status is current (implemented where completed).
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


## Home menu checks

- [ ] Home shows Start / Records / Options entries.
- [ ] Home Left/Right (and Up/Down) changes highlighted entry with safe wrap.
- [ ] Home Enter/Space confirms Start -> Mode Select, Records -> RecordsScene, Options -> OptionsScene.

## Options behavior checks

- [ ] Home -> Options opens OptionsScene.
- [ ] Options Esc returns Home.
- [ ] Options can toggle/save Effects ON/OFF and Screen Shake ON/OFF.
- [ ] Options has a Reset Preferences row with two-step confirm behavior.
- [ ] Reload + reopen Options reflects saved preference values.
- [ ] Effects OFF hides nonessential visual extras (hit spark / CLEAN HIT sub-label / win-draw accent effects).
- [ ] Screen Shake OFF disables tiny shake only.
- [ ] Reset Preferences first confirm arms reset and second confirm executes reset.
- [ ] Moving selection away from Reset Preferences cancels pending confirmation.
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

## Phase 8-3 Reset Preferences design checklist (docs)

- [ ] Reset Preferences is defined as settings-only (`instrument-brawl:settings` only).
- [ ] Docs state Reset Preferences must not modify/delete `instrument-brawl:records`.
- [ ] Docs keep Reset Preferences separate from future Reset Records (no reset-all in this phase).
- [ ] Reset default values are explicit: `electric-guitar`, `bass`, `human`, `effectsEnabled: true`, `screenShakeEnabled: true`.
- [ ] Docs define simple OptionsScene UX: separate row, two-step confirm (`Press again to confirm`), Escape/move-away cancel.
- [ ] Docs define expected post-reset behavior for Mode Select, Character Select, and Options defaults restoration.
- [ ] Docs define safe failure/fallback behavior for unavailable/failing localStorage and preserve sanitize/default fallback.

## Phase 8-3 future implementation verification checklist

- [ ] Change settings away from defaults (fighters/mode/effects/screen shake).
- [ ] Use Reset Preferences action from Options.
- [ ] Reload page.
- [ ] Confirm defaults are restored in settings-backed UI state.
- [ ] Confirm Effects and Screen Shake return to ON.
- [ ] Confirm Human mode/default fighters return where applicable (unless scene data override applies).
- [ ] Confirm Records storage is not removed or modified.
- [ ] Confirm gameplay values/logic are unchanged (HP/damage/knockback/cooldown/duration/hitbox/CPU/one-hit rule).

- [ ] Records storage utility helpers exist for `instrument-brawl:records` load/save/sanitize with safe fallback behavior and no runtime counting yet.

**Next recommended task:** Phase 8-12: Retire / Forfeit design docs.


## Phase 8-5 Records runtime design checklist (docs)

- [ ] Records are local-only (no server/account/cloud, no online rank/matchmaking stats).
- [ ] Records key is explicitly `instrument-brawl:records` and separate from `instrument-brawl:settings`.
- [ ] Initial records payload is versioned and includes: version, totalMatches, p1Wins, p2Wins, draws, cpuMatches, local2pMatches, lastPlayedAt.
- [ ] Default values are explicit: version 1, all counters 0, lastPlayedAt null.
- [ ] Counting rules define total/win/draw/mode increments and ISO `lastPlayedAt` update.
- [ ] Docs explicitly forbid per-hit logs, damage history, replay data, and detailed analytics.
- [ ] Double-count prevention is explicit: one completed match saved once.
- [ ] Docs explicitly state no duplicate counts from Result transitions, R rematch, C return, or Home return.
- [ ] Preferred future save timing is explicit and justified (save once on first ResultScene entry).
- [ ] Sanitize/fallback behavior is explicit for unavailable storage, parse failure, invalid payload, and unknown version.
- [ ] Docs state invalid records must not delete settings and Reset Preferences must not delete records.

## Phase 8-5 future implementation verification checklist

- [ ] Finish a P1 win and confirm `totalMatches` + `p1Wins` increment once.
- [ ] Finish a P2 win and confirm `totalMatches` + `p2Wins` increment once.
- [ ] Finish a draw and confirm `totalMatches` + `draws` increment once.
- [ ] Finish a CPU match and confirm `cpuMatches` increments once.
- [ ] Finish a Local 2P match and confirm `local2pMatches` increments once.
- [ ] Use `R` rematch and confirm previous result is not double-counted.
- [ ] Use `C` return-to-character-select and confirm previous result is not double-counted.
- [ ] Return Home from Result and confirm previous result is not double-counted.
- [ ] Confirm Reset Preferences does not delete records.
- [ ] Confirm settings and records use separate keys.
- [ ] RecordsScene shell can open (direct scene start/dev hook) and display stored local records.
- [ ] RecordsScene shows Last Played as `Never` when `lastPlayedAt` is null.
- [ ] RecordsScene supports Esc / Enter / Space return Home.
- [ ] RecordsScene Reset Records first confirm arms and second confirm executes reset.
- [ ] Moving selection away from Reset Records cancels pending confirmation.
- [ ] Reset Records returns counters to 0 and Last Played to Never.
- [ ] Reset Records does not change `instrument-brawl:settings`.


## Phase 8-10 Reset Records design checklist (docs)

- [ ] Docs define Reset Records as records-only (`instrument-brawl:records` only).
- [ ] Docs state Reset Records must not modify/delete `instrument-brawl:settings`.
- [ ] Docs keep Reset Records separate from Reset Preferences (no Reset All in this phase).
- [ ] Reset default records values are explicit (version 1, counters 0, `lastPlayedAt: null`).
- [ ] Docs define simple RecordsScene UX: separate row, two-step confirm, Escape/move-away cancel.
- [ ] Docs define expected post-reset behavior: counters 0 and Last Played Never, settings unchanged.
- [ ] Docs define safe failure/fallback behavior and no settings deletion on invalid records.

## Phase 8-10 future implementation verification checklist

- [ ] Play/simulate at least one match so records are non-zero.
- [ ] Use Reset Records from RecordsScene.
- [ ] Confirm all record counters return to 0.
- [ ] Confirm Last Played returns to Never.
- [ ] Reload page and confirm records remain reset.
- [ ] Confirm `instrument-brawl:settings` remains unchanged.
- [ ] Confirm Reset Preferences does not delete records unless Reset Records is used separately.
- [ ] Confirm gameplay values/logic are unchanged.


## Phase 8-12 Retire / Forfeit design checklist (docs)

- [ ] Docs define Retire/Forfeit as a voluntary early-end escape hatch, not a complex rule system.
- [ ] Docs define winner mapping: P1 retire -> P2 win, P2 Human retire -> P1 win, CPU does not retire.
- [ ] Docs define retire as non-draw and keep existing ResultScene flow with result kind `p1`/`p2`.
- [ ] Docs define retire records behavior using normal counters (`totalMatches`, winner bucket, mode split, `lastPlayedAt`).
- [ ] Docs explicitly forbid retire-specific counters in Phase 8.
- [ ] Docs define compact future UI direction in Pause/Quick Help with two-step confirm.
- [ ] Docs define cancel paths and no full pause/admin menu expansion.
- [ ] Docs define control constraints (no battle `R` repurpose; no control stealing).
- [ ] Docs define timing constraints (only after Fight, disabled after `matchOver`).
- [ ] Docs define simple ResultScene text direction without adding a new result bucket.
- [ ] Docs keep timer/rounds/online/server/CPU-retire-AI out of scope.

## Phase 8-12 future implementation verification checklist

- [ ] P1 retire causes P2 win.
- [ ] P2 Human retire causes P1 win.
- [ ] P1 vs CPU retire causes CPU/P2 win.
- [ ] CPU does not retire by itself.
- [ ] Retire is not available before Fight.
- [ ] Retire does nothing after `matchOver`.
- [ ] Retire result records exactly once.
- [ ] `R` rematch after retire does not double-count previous result.
- [ ] `C` return after retire does not double-count previous result.
- [ ] Records counters follow normal `p1`/`p2` win rules.
- [ ] Settings and records reset behavior remains unchanged.


## Phase 8-13 Timer design checklist (docs)

- [ ] Docs define timer as optional future pacing tool, not a Phase 8 implementation item.
- [ ] Docs keep no-timer behavior as baseline and timer disabled by default for now.
- [ ] Docs define future duration candidates (60 default candidate, 45/90 alternatives).
- [ ] Docs define timeout winner rule (higher HP wins, equal HP draw) without a new result bucket.
- [ ] Docs define timeout records behavior using existing normal counters and once-per-result guard.
- [ ] Docs explicitly forbid timer-specific records fields in Phase 8.
- [ ] Docs define compact future timer UI direction and no animation-heavy/audio countdown behavior.
- [ ] Docs define pause behavior (timer pauses during Pause/Quick Help and starts after Ready/Fight).
- [ ] Docs define retire-vs-timeout precedence rules while keeping both features separate.
- [ ] Docs keep rounds/sudden death/overtime/time bonus out of scope.

## Phase 8-13 future implementation verification checklist

- [ ] Timer does not start before Fight.
- [ ] Timer pauses during Pause / Quick Help.
- [ ] Timer resumes after unpause.
- [ ] Timeout with P1 higher HP results in P1 win.
- [ ] Timeout with P2 higher HP results in P2 win.
- [ ] Timeout with equal HP results in draw.
- [ ] Timeout records exactly once.
- [ ] `R` rematch after timeout does not double-count previous result.
- [ ] `C` return after timeout does not double-count previous result.
- [ ] Timer does not change HP, damage, knockback, hitboxes, CPU behavior, or one-hit-per-attack.
- [ ] Retire result takes precedence if retire happens before timeout.
- [ ] Existing KO/draw behavior remains unchanged.
