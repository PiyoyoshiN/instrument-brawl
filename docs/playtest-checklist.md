# Playtest Checklist (Phase 8 checkpoint)

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

**Next recommended task:** Phase 9-13: Result equipment display.


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


## Phase 8-14 Equipment / Amp design checklist (docs)

- [ ] Docs define Equipment as future lightweight optional match-customization, not RPG/progression.
- [ ] Docs keep no-equipment behavior as baseline and equipment unavailable in Phase 8 implementation.
- [ ] Docs define future structure as 0-or-1 support equipment per player with match-local scope.
- [ ] Docs define Amp as design-only first candidate and forbid implementation in this task.
- [ ] Docs list Amp candidate options as experiments without final stat decisions.
- [ ] Docs include balance guardrails (no huge spikes, preserve fighter identity, no critical/guard/special systems in Phase 8).
- [ ] Docs define future UI direction (`Equipment: None` / `Equipment: Amp`) without implementing UI now.
- [ ] Docs keep equipment out of records schema/analytics in Phase 8.
- [ ] Docs defer detailed `attackMethod` / `impactClass` decisions to Phase 8-15.
- [ ] Docs keep equipment/ranged/sonic/combat-tuning/progression/assets/online out of scope.

## Phase 8-14 future implementation verification checklist

- [ ] Equipment defaults to `None` when eventually implemented.
- [ ] No-equipment baseline still works.
- [ ] Equipment does not change records schema.
- [ ] Equipment does not affect settings/reset behavior.
- [ ] Amp does not create accidental huge damage/range advantage without tradeoff.
- [ ] Amp does not obscure hit readability.
- [ ] Fighter identity remains readable with equipment.
- [ ] Equipment can be disabled for simple matches.
- [ ] Same-fighter and same-equipment mirror matches remain understandable.
- [ ] No gameplay values change during this docs-only task.


## Phase 8-15 attackMethod / impactClass design checklist (docs)

- [ ] Docs define `attackMethod` as future delivery-style label and `impactClass` as future impact-feel label.
- [ ] Docs list `attackMethod` candidates: `direct`, `sonic`, `ranged`, `hybrid`.
- [ ] Docs list `impactClass` candidates: `physical`, `sound`, `burst`, `technical`.
- [ ] Docs clarify labels are documentation/planning categories and do not change gameplay by themselves.
- [ ] Docs keep current runtime as conceptual `direct` baseline and avoid runtime implementation in this phase.
- [ ] Docs explain the difference between the two categories with non-binding examples.
- [ ] Docs avoid final per-fighter category assignments in this task.
- [ ] Docs relate Amp/Equipment as future experiments only, not implementation commitments.
- [ ] Docs keep categories out of records/settings schema in Phase 8.
- [ ] Docs keep combat tuning/projectiles/sonic implementation out of scope.

## Phase 8-15 future implementation verification checklist

- [ ] Current direct baseline still behaves unchanged.
- [ ] Future `attackMethod` labels do not change gameplay unless explicitly implemented later.
- [ ] Future `impactClass` labels do not change damage/knockback/cooldown by themselves.
- [ ] Ranged/sonic concepts remain out of Phase 8 runtime.
- [ ] Amp remains design-only during this phase.
- [ ] Records schema remains unchanged.
- [ ] Settings/reset behavior remains unchanged.
- [ ] Fighter identity remains readable.
- [ ] No gameplay values change during this docs-only task.


## Phase 8 implemented feature checks (pre-checkpoint)

### Options + Reset Preferences (implemented)

- [ ] Home -> Options -> Home flow works.
- [ ] Options toggles Effects ON/OFF.
- [ ] Options toggles Screen Shake ON/OFF.
- [ ] Reset Preferences exists in OptionsScene.
- [ ] Reset Preferences requires two-step confirmation.
- [ ] Reset Preferences restores defaults: P1 `electric-guitar`, P2 `bass`, P2 mode `human`, Effects ON, Screen Shake ON.
- [ ] Reset Preferences changes only `instrument-brawl:settings` and does not delete/modify `instrument-brawl:records`.

### Records runtime (implemented)

- [ ] `instrument-brawl:records` is separate from `instrument-brawl:settings`.
- [ ] P1 win increments `totalMatches` and `p1Wins` exactly once.
- [ ] P2 win increments `totalMatches` and `p2Wins` exactly once.
- [ ] Draw increments `totalMatches` and `draws` exactly once.
- [ ] P1 vs CPU match increments `cpuMatches` exactly once.
- [ ] Local 2P match increments `local2pMatches` exactly once.
- [ ] `lastPlayedAt` updates after recorded match completion.
- [ ] `R` rematch from Result does not double-count previous match.
- [ ] `C` return-to-character-select from Result does not double-count previous match.
- [ ] Enter/Space return Home from Result does not double-count previous match.

### RecordsScene shell (implemented)

- [ ] Home -> Records opens RecordsScene.
- [ ] RecordsScene displays Total Matches / P1 Wins / P2 Wins / Draws / VS CPU Matches / Local 2P Matches / Last Played.
- [ ] RecordsScene shows `Last Played: Never` when `lastPlayedAt` is null.
- [ ] RecordsScene supports return Home (Esc / Enter / Space as currently implemented).
- [ ] Home -> Records -> Home flow works.

### Reset Records (implemented)

- [ ] Reset Records exists in RecordsScene.
- [ ] Reset Records requires two-step confirmation.
- [ ] Reset Records resets only `instrument-brawl:records`.
- [ ] Reset Records sets counters to 0.
- [ ] Reset Records sets `lastPlayedAt` to null / `Last Played: Never`.
- [ ] Reset Records does not delete/modify `instrument-brawl:settings`.
- [ ] Reset Records does not change Effects / Screen Shake.
- [ ] Reset Records does not change last selected fighters or P2 mode.

## Phase 8 design-only future checks (not implemented yet)

### Retire / Forfeit (design-only)

- [ ] P1 retire -> P2 win.
- [ ] P2 Human retire -> P1 win.
- [ ] CPU does not retire by itself.
- [ ] Retire result records exactly once.

### Timer (design-only)

- [ ] Timer starts after Fight.
- [ ] Timer pauses during Pause / Quick Help and resumes after unpause.
- [ ] Timeout higher HP decides winner; equal HP is draw.
- [ ] Timeout result records exactly once.

### Equipment / Amp (design-only)

- [ ] Future default equipment is `None`.
- [ ] Equipment does not change records schema in Phase 8.
- [ ] Amp remains design-only in Phase 8 runtime.

### attackMethod / impactClass (design-only)

- [ ] Labels do not change gameplay by themselves.
- [ ] No runtime/schema change in Phase 8.

## Phase 8 regression guardrails (must remain unchanged)

- [ ] HP unchanged.
- [ ] Damage unchanged.
- [ ] Knockback unchanged.
- [ ] Attack cooldown unchanged.
- [ ] Attack duration unchanged.
- [ ] Hitbox behavior unchanged.
- [ ] CPU behavior unchanged.
- [ ] One-hit-per-attack unchanged.
- [ ] Ready / Fight timing unchanged.
- [ ] Pause / Quick Help behavior unchanged.
- [ ] ResultScene `R` / `C` / Home transitions unchanged.


## Phase 9-1 scope and guardrails checklist (docs)

- [ ] Docs define Phase 9 as **Equipment Shell & Attack Identity Foundation**.
- [ ] Docs state Phase 9-1 is docs-only.
- [ ] Docs define equipment shell purpose (selection, scene handoff, persistence planning, labels).
- [ ] Docs define 0-or-1 equipment per player direction.
- [ ] Docs list future candidates: `none` / `amp` / `pick` / `case`.
- [ ] Docs keep Amp/runtime equipment behavior as not implemented in this PR.
- [ ] Docs keep `attackMethod` / `impactClass` as planning language (no runtime/schema changes now).
- [ ] Docs preserve Phase 8 guardrails (HP/damage/knockback/cooldown/duration/hitbox/CPU/one-hit/Ready-Fight/Pause/Result transitions).
- [ ] Docs explicitly forbid combat-value changes in Phase 9-1 docs step.
- [ ] Docs explicitly forbid equipment-specific records schema/analytics in Phase 9-1 docs step.
- [ ] Docs confirm this PR does not modify runtime code.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-2 docs cleanup checklist (docs)

- [ ] Docs consistently mark Phase 8 as complete.
- [ ] Docs consistently mark Phase 9-1 as complete.
- [ ] Current next recommended task is Phase 9-13: Result equipment display.
- [ ] Stale status wording (records/reset/options future scope) is updated to current implemented state.
- [ ] Docs explicitly keep Phase 9 runtime equipment features as not implemented yet.
- [ ] Docs preserve guardrails: no combat-value changes and no equipment records analytics in this cleanup task.
- [ ] This PR does not modify runtime code.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-3 equipment concept checklist (docs)

- [ ] Equipment concept purpose is defined (lightweight optional support shell).
- [ ] Equipment non-purpose is defined (not combat buffs/stat tuning/meta-progression).
- [ ] `none` / No Accessory is documented as baseline default.
- [ ] `amp` / `pick` / `case` are documented as flavor-first concepts.
- [ ] Amp/Pick/Case are explicitly not defined as stat buffs in this step.
- [ ] No runtime code is modified in this docs task.
- [ ] Equipment-specific records schema/analytics remain out of scope.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-4 equipment data model checklist (docs)

- [ ] Planned `EquipmentId` union is documented: `none | amp | pick | case`.
- [ ] Planned `EquipmentDefinition` shape is documented (`id`, `displayName`, `shortLabel`, `description`, `conceptRole`).
- [ ] `none` is documented as safe default/fallback.
- [ ] Amp/Pick/Case remain metadata/flavor only in this step.
- [ ] No combat/stat fields are introduced in the planned model.
- [ ] No runtime code is modified in this docs task.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-5 equipment registry checklist

- [ ] `EquipmentId` runtime union exists with `none | amp | pick | case`.
- [ ] `EquipmentDefinition` runtime metadata shape exists (`id`, `displayName`, `shortLabel`, `description`, `conceptRole`).
- [ ] Runtime definitions exist for `none`, `amp`, `pick`, `case`.
- [ ] `isEquipmentId(value)` helper exists and validates known IDs only.
- [ ] `getEquipmentDefinition(id)` helper falls back to `none` for invalid/missing IDs.
- [ ] Registry remains metadata-only (no combat/stat fields).
- [ ] No equipment selection scene, handoff, persistence, HUD/Result labels, or Amp visual effect is added in this task.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-6 EquipmentSelectScene design checklist (docs)

- [ ] Docs define EquipmentSelectScene as a future screen between Character Select and Battle.
- [ ] Docs define future flow target including Equipment Select without claiming runtime implementation.
- [ ] Docs define scene goals (P1/P2 fighter context, P1/P2 equipment rows, `none/amp/pick/case`, defaults to `none`).
- [ ] Docs define simple future controls (Left/Right, Up/Down, Enter/Space, Esc; optional future `R` reset note).
- [ ] Docs define compact visual direction (`Equipment Select`, rows, labels, descriptions, flavor-only hint).
- [ ] Docs define future data direction and fallback-to-`none` behavior for invalid/missing IDs.
- [ ] Docs keep buff/progression/inventory/analytics systems out of scope in this step.
- [ ] No runtime code is modified in this docs task.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-7 EquipmentSelectScene shell checklist

- [ ] `EquipmentSelectScene` class exists and is registered in Phaser scene list.
- [ ] Scene shows static shell UI: title, P1/P2 equipment as None, shell hints, Esc: Back.
- [ ] Scene accepts optional fighter/mode scene data safely (fallback text when missing).
- [ ] Scene uses safe default equipment display from `getEquipmentDefinition('none')`.
- [ ] Esc returns to CharacterSelectScene safely.
- [ ] Normal flow remains unchanged: Home -> Mode Select -> Character Select -> Battle -> Result.
- [ ] No equipment selection controls/handoff/persistence/HUD/Result labels/effects implemented in this task.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-8 P1/P2 equipment selection checklist

- [ ] EquipmentSelectScene has local `player1EquipmentId` / `player2EquipmentId` state defaulting to `none`.
- [ ] Up/Down changes focused row between P1 and P2.
- [ ] Left/Right cycles equipment in order `none -> amp -> pick -> case -> none` with reverse wrap on Left.
- [ ] Scene display updates selected P1/P2 equipment labels and focused equipment description.
- [ ] Enter/Space behavior was shell-only in 9-8 and is superseded by 9-9 handoff behavior.
- [ ] Esc returns to CharacterSelectScene with existing fighter/mode context.
- [ ] No battle handoff/persistence/HUD/Result/effects/analytics are implemented in this task.
- [ ] Normal flow remains unchanged: Home -> Mode Select -> Character Select -> Battle -> Result.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-9 equipment data handoff checklist

- [ ] CharacterSelectScene confirm routes to EquipmentSelectScene.
- [ ] EquipmentSelectScene confirm routes to BattleScene.
- [ ] Selected `player1EquipmentId` / `player2EquipmentId` are passed to BattleScene scene data.
- [ ] Invalid/missing equipment IDs resolve to `none` in BattleScene.
- [ ] Equipment has no gameplay effect.
- [ ] No localStorage equipment persistence is added.
- [ ] No Battle HUD equipment labels are added.
- [ ] No Result equipment display is added.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-10 rematch / return preservation checklist

- [ ] BattleScene passes resolved equipment IDs to ResultScene.
- [ ] ResultScene rematch (`R`) keeps selected equipment IDs.
- [ ] ResultScene return (`C`) preserves selected equipment IDs into CharacterSelectScene scene data.
- [ ] CharacterSelectScene forwards preserved equipment IDs to EquipmentSelectScene on confirm.
- [ ] EquipmentSelectScene initializes from incoming equipment IDs.
- [ ] EquipmentSelectScene Esc back preserves current equipment IDs to CharacterSelectScene.
- [ ] Invalid/missing equipment IDs fall back to `none`.
- [ ] No localStorage equipment persistence is added.
- [ ] No Battle HUD equipment labels are added.
- [ ] No visible Result equipment display is added.
- [ ] Equipment has no gameplay effect.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-11 localStorage equipment persistence checklist

- [ ] Last selected P1/P2 equipment IDs persist in `instrument-brawl:settings`.
- [ ] Old settings without equipment fields load safely.
- [ ] Invalid stored equipment IDs fall back to `none`.
- [ ] CharacterSelectScene forwards stored equipment IDs to EquipmentSelectScene.
- [ ] Stored equipment restores through Home -> Mode Select -> Character Select -> Equipment Select.
- [ ] EquipmentSelectScene confirm saves selected equipment IDs.
- [ ] Reset Preferences resets persisted equipment selections to `none`.
- [ ] Records schema and `instrument-brawl:records` behavior are unchanged.
- [ ] No Battle HUD equipment labels are added.
- [ ] No visible Result equipment display is added.
- [ ] Equipment has no gameplay effect.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-12 Battle HUD equipment labels checklist

- [ ] BattleScene shows P1 equipment label.
- [ ] BattleScene shows P2 equipment label.
- [ ] `None` displays clearly when no equipment is selected.
- [ ] `Amp` / `Pick` / `Case` short labels display correctly.
- [ ] Missing/invalid equipment IDs fall back to `None` safely.
- [ ] Labels do not overlap critical HUD/battle text.
- [ ] Equipment still has no gameplay effect.
- [ ] localStorage settings schema is unchanged.
- [ ] records schema is unchanged.
- [ ] Result equipment display is not added.
- [ ] Amp visual effect is not added.
- [ ] Next recommended task is Phase 9-13: Result equipment display.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 9-13 Result equipment display checklist

- [ ] ResultScene shows P1 equipment label.
- [ ] ResultScene shows P2 equipment label.
- [ ] `None` displays clearly when no equipment is selected.
- [ ] `Amp` / `Pick` / `Case` short labels display correctly.
- [ ] Missing/invalid equipment IDs fall back to `None` safely.
- [ ] Result display uses already-resolved equipment definitions.
- [ ] Result display does not affect rematch / return behavior.
- [ ] Equipment still has no gameplay effect.
- [ ] Battle HUD equipment labels remain unchanged.
- [ ] localStorage settings schema is unchanged.
- [ ] records schema is unchanged.
- [ ] Amp visual effect is not added.
- [ ] Next recommended task is Phase 9-14: Amp visual-only accent trial.

**Next recommended task:** Phase 9-14: Amp visual-only accent trial.


## Phase 9-14 Amp visual-only accent trial checklist

- [ ] Amp-selected P1 shows the visual accent in BattleScene.
- [ ] Amp-selected P2 shows the visual accent in BattleScene.
- [ ] `none` / `pick` / `case` do not show the Amp accent.
- [ ] Amp accent is visual-only.
- [ ] Amp does not change HP.
- [ ] Amp does not change damage.
- [ ] Amp does not change knockback.
- [ ] Amp does not change attack cooldown or duration.
- [ ] Amp does not change range or hitboxes.
- [ ] Amp does not change speed or defense.
- [ ] Amp does not change CPU behavior.
- [ ] Amp does not change Ready/Fight/Pause/Quick Help behavior.
- [ ] Battle HUD equipment labels remain unchanged.
- [ ] ResultScene equipment labels remain unchanged.
- [ ] localStorage settings schema is unchanged.
- [ ] records schema is unchanged.
- [ ] no assets/audio are added.
- [ ] Next task is Phase 9-15: Future equipment effect docs.

**Next recommended task:** Phase 9-15: Future equipment effect docs.
