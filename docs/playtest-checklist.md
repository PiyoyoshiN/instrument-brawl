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


## Phase 9-15 Future equipment effect docs checklist

- [ ] Future equipment effects are documented as docs-only direction.
- [ ] No runtime code is modified in this docs step.
- [ ] Amp/Pick/Case future directions are clearly marked as future only.
- [ ] No equipment gameplay effects are implemented.
- [ ] No localStorage settings schema changes are introduced.
- [ ] No records schema changes are introduced.
- [ ] No assets/audio are added.
- [ ] Equipment-specific records/analytics remain out of scope.
- [ ] Inventory/unlocks/rarity/currency/progression remain out of scope.

## Phase 9-16 Playtest checklist update checklist

- [ ] Existing Phase 9 checklist sections are preserved.
- [ ] Phase 9-15 checklist section is added.
- [ ] Phase 9-16 checklist section is added/updated.
- [ ] Phase 9-17 checkpoint checklist section is added.
- [ ] Phase 9 implemented features are still listed accurately.
- [ ] No runtime code is modified by this checklist update.
- [ ] No schema changes are introduced by this checklist update.

## Phase 9-17 Phase 9 checkpoint checklist

- [ ] Docs mark Phase 9-15/9-16/9-17 as complete.
- [ ] Docs clearly mark Phase 9 checkpoint as complete.
- [ ] Equipment metadata registry is listed as implemented.
- [ ] EquipmentSelectScene is listed as implemented.
- [ ] P1/P2 equipment selection is listed as implemented.
- [ ] Equipment IDs handoff to Battle/Result is listed as implemented.
- [ ] Rematch/return equipment ID preservation is listed as implemented.
- [ ] localStorage equipment persistence is listed as implemented.
- [ ] Battle HUD equipment labels are listed as implemented.
- [ ] ResultScene equipment labels are listed as implemented.
- [ ] Amp BattleScene-only visual accent is listed as implemented.
- [ ] Equipment is still marked gameplay-neutral.
- [ ] Pick/Case effects are still marked not implemented.
- [ ] Future equipment gameplay effects are still marked not implemented.
- [ ] records schema is unchanged.
- [ ] settings schema is unchanged in this closeout step.
- [ ] No assets/audio are added.
- [ ] Next recommended task is Phase 10-1: Phase 10 scope docs.

**Next recommended task:** Phase 10-1: Phase 10 scope docs.


## Phase 10-1 scope docs checklist

- [ ] This PR is docs-only.
- [ ] No runtime files are changed.
- [ ] Phase 10 name is documented as `Equipment Gameplay Prototype v1`.
- [ ] Phase 10 is clearly described as prototype / fun-core validation, not final combat system.
- [ ] Phase 10 scope explains small, readable, reversible per-PR changes.
- [ ] Amp future gameplay direction is documented (short sonic reach/echo, non-projectile, non-screen-wide).
- [ ] Amp compatibility direction is documented (Drum Sticks incompatibility in later implementation).
- [ ] Case future gameplay direction is documented (normal damage reduction candidate around 20%).
- [ ] Drum Sticks critical future direction is documented (40% / 1.5x candidate and Case interaction).
- [ ] Pick treatment is documented as no gameplay effect in Phase 10 (`準備中` direction only).
- [ ] Japanese UI policy is documented at high level as future work.
- [ ] One attack can hit only once is preserved as a guardrail.
- [ ] No equipment gameplay effects are implemented in this docs task.
- [ ] No localStorage settings schema changes are introduced.
- [ ] No records schema changes are introduced.
- [ ] No equipment-specific records/analytics are introduced.
- [ ] No assets/audio/images/3D are added.
- [ ] Suggested 10-1..10-20 breakdown is documented.
- [ ] Next recommended task is Phase 10-3: Amp compatibility rules docs.

## Phase 10-3 Amp compatibility rules docs checklist

- [ ] This PR is docs-only.
- [ ] No runtime files are changed.
- [ ] Amp-compatible fighters are documented: Electric Guitar / Bass / Keyboard.
- [ ] Drum Sticks + Amp incompatibility is documented.
- [ ] `none` compatibility for all fighters is documented.
- [ ] `case` compatibility for all fighters is documented.
- [ ] `pick` treatment is documented as no gameplay effect in Phase 10 (`準備中` direction only).
- [ ] Future stale Drum Sticks + Amp saved/scene data is documented to safely resolve to `none`.
- [ ] Future invalid combinations are documented to fail safely without crash.
- [ ] No Amp gameplay effects are implemented in this docs task.
- [ ] No localStorage schema changes are introduced.
- [ ] No records schema changes are introduced.
- [ ] One attack can hit only once remains a documented guardrail.
- [ ] No equipment-specific records analytics are introduced.
- [ ] No assets/audio/images/3D are added.
- [ ] Next recommended task is Phase 10-4: Damage pipeline prep docs.

## Phase 10-4 damage pipeline prep docs checklist

- [ ] This PR is docs-only.
- [ ] No runtime files are changed.
- [ ] Damage resolution order is documented from attacker/defender resolution to final HP subtraction and feedback.
- [ ] Drum Sticks critical candidate is documented (40% / 1.5x, 8 -> 12 target).
- [ ] Case normal damage reduction candidate is documented (20%, floor then min-1 clamp direction).
- [ ] Critical bypasses defender Case reduction is documented.
- [ ] Drum Sticks + Case critical-identity loss direction is documented.
- [ ] Amp damage interaction is documented as no damage increase and no multi-hit.
- [ ] One attack can hit only once remains a documented guardrail.
- [ ] Pick has no Phase 10 gameplay effect documented.
- [ ] No records schema changes are introduced.
- [ ] No settings schema changes are introduced.
- [ ] No equipment-specific analytics/records are introduced.
- [ ] No assets/audio/images/3D are added.
- [ ] Next recommended task is Phase 10-5: Amp gameplay prototype v1.

## Phase 10-6 Amp gameplay playtest checklist update

- [ ] Electric Guitar + Amp has slightly longer reach than Electric Guitar + none.
- [ ] Bass + Amp has slightly longer reach than Bass + none.
- [ ] Keyboard + Amp has slightly longer reach than Keyboard + none.
- [ ] Amp reach difference is small/readable and not a full ranged attack.
- [ ] Amp attack rectangle may appear slightly wider but still feels melee/sonic reach.
- [ ] Amp does not create a projectile.
- [ ] Amp does not create a screen-wide attack.
- [ ] Amp does not create a separate damaging echo hitbox.
- [ ] Amp does not create multi-hit behavior.
- [ ] One attack can hit only once.
- [ ] Drum Sticks + Amp does not gain Amp reach.
- [ ] Drum Sticks + Amp resolves safely to `none` in Battle/Result display.
- [ ] Drum Sticks does not show Amp accent when Amp was resolved to `none`.
- [ ] Electric Guitar / Bass / Keyboard can still show Amp accent when Amp is selected and effects are enabled.
- [ ] Invalid/stale equipment data does not crash.
- [ ] Amp does not increase damage.
- [ ] Amp does not change knockback.
- [ ] Amp does not change attack cooldown.
- [ ] Amp does not change attack duration.
- [ ] Amp does not change movement speed.
- [ ] Amp does not change HP.
- [ ] Amp does not change defense.
- [ ] Case reduction is still not implemented.
- [ ] Critical hits are still not implemented.
- [ ] Pick effect is still not implemented.
- [ ] CPU using an Amp-compatible fighter with Amp can use slightly longer reach.
- [ ] CPU mode does not crash.
- [ ] ResultScene still opens normally.
- [ ] ResultScene shows sanitized equipment labels.
- [ ] `R` rematch still works.
- [ ] `C` return still works.
- [ ] Home return still works.
- [ ] records schema is unchanged.
- [ ] settings schema is unchanged.
- [ ] no Amp usage records are added.
- [ ] no equipment-specific win-rate analytics are added.
- [ ] Reset Preferences still resets equipment to `none`.

## Phase 10-9 Case reduction checklist update

- [ ] Electric Guitar attacking a Case target deals 8 instead of 10.
- [ ] Bass attacking a Case target deals 8 instead of 10.
- [ ] Keyboard attacking a Case target deals 7 instead of 9.
- [ ] Drum Sticks attacking a Case target deals 6 instead of 8.
- [ ] Non-Case targets still take normal base damage.
- [ ] Final damage is clamped to minimum 1.
- [ ] Hit marker shows final reduced damage, not original base damage.
- [ ] HP reduction and hit marker number match.
- [ ] Case does not reduce knockback.
- [ ] Case does not increase max HP.
- [ ] Case does not change movement speed.
- [ ] Case does not change attack cooldown.
- [ ] Case does not change attack duration.
- [ ] Case does not add guard / just guard.
- [ ] Case does not add block / armor mechanics.
- [ ] Case does not create new UI screens.
- [ ] Critical hits are still not implemented.
- [ ] Case critical bypass is still not implemented.
- [ ] Pick effect is still not implemented.
- [ ] Amp reach still works.
- [ ] Amp still does not increase damage.
- [ ] One attack can still hit only once.
- [ ] Battle HUD still displays equipment labels.
- [ ] ResultScene still opens normally.
- [ ] ResultScene still displays equipment labels.
- [ ] `R` rematch still works.
- [ ] `C` return still works.
- [ ] Home return still works.
- [ ] CPU mode does not crash.
- [ ] records schema is unchanged.
- [ ] settings schema is unchanged.
- [ ] no Case usage records are added.
- [ ] no damage dealt records are added.
- [ ] no equipment-specific win-rate analytics are added.
- [ ] Reset Preferences still resets equipment to `none`.

**Next recommended task:** Phase 10-10: Case reduction sanity pass.

## Phase 10-13 Critical behavior checklist update

- [ ] Drum Sticks + none sometimes deals 12 instead of 8.
- [ ] Drum Sticks + none normal hit deals 8 against non-Case target.
- [ ] Drum Sticks + none critical hit deals 12 against non-Case target.
- [ ] Drum Sticks + none normal hit against Case target deals 6.
- [ ] Drum Sticks + none critical hit against Case target deals 12.
- [ ] Drum Sticks critical bypasses defender Case reduction.
- [ ] Drum Sticks critical does not create a second hit.
- [ ] One attack can still hit only once.
- [ ] Critical hit shows final damage in the main hit marker.
- [ ] With effects enabled, critical hit shows `クリティカル！`.
- [ ] With effects disabled, critical hit does not crash and final damage still applies.
- [ ] Drum Sticks + Case does not critical.
- [ ] Drum Sticks + Case against non-Case target deals 8.
- [ ] Drum Sticks + Case against Case target deals 6.
- [ ] Drum Sticks + Case still receives defensive Case reduction when hit by opponent.
- [ ] Drum Sticks + Case tradeoff is attacker-side only.
- [ ] Electric Guitar does not critical.
- [ ] Bass does not critical.
- [ ] Keyboard does not critical.
- [ ] Electric Guitar/Bass against Case target still deals 8.
- [ ] Keyboard against Case target still deals 7.
- [ ] Amp reach still works.
- [ ] Amp still does not increase damage.
- [ ] Pick effect is still not implemented.
- [ ] Critical does not change knockback.
- [ ] Critical does not change movement speed.
- [ ] Critical does not change max HP.
- [ ] Critical does not change attack cooldown.
- [ ] Critical does not change attack duration.
- [ ] Critical does not change attack range.
- [ ] Critical does not add guard / just guard.
- [ ] Critical does not add block / armor mechanics.
- [ ] Critical does not create multi-hit behavior.
- [ ] Critical does not add new UI screens.
- [ ] Case still does not reduce knockback.
- [ ] Case still does not increase HP.
- [ ] Case still does not add guard / just guard.
- [ ] Battle HUD still displays equipment labels.
- [ ] ResultScene still opens normally.
- [ ] ResultScene still displays equipment labels.
- [ ] `R` rematch still works.
- [ ] `C` return still works.
- [ ] Home return still works.
- [ ] CPU mode does not crash.
- [ ] records schema is unchanged.
- [ ] settings schema is unchanged.
- [ ] no critical count records are added.
- [ ] no damage dealt records are added.
- [ ] no equipment-specific win-rate analytics are added.
- [ ] Reset Preferences still resets equipment to `none`.

**Next recommended task:** Phase 10-14: Equipment interaction matrix docs.

## Phase 10-18 Prototype balancing checklist update

### Drum Sticks balance check

- [ ] Drum Sticks + none still sometimes deals 12.
- [ ] Drum Sticks + none critical appears less often than the old 40% prototype.
- [ ] Drum Sticks + none critical rate target is now 35%.
- [ ] Drum Sticks + none normal hit remains 8.
- [ ] Drum Sticks + none critical hit remains 12.
- [ ] Drum Sticks + none critical still bypasses defender Case.
- [ ] Drum Sticks + Case still does not critical.
- [ ] Drum Sticks + Case against non-Case target still deals 8.
- [ ] Drum Sticks + Case against Case target still deals 6.
- [ ] Drum Sticks + Pick can still critical because Pick is not Case.

### Case balance check

- [ ] Case still reduces normal incoming damage by 20%.
- [ ] Electric Guitar/Bass normal hit against Case target still deals 8.
- [ ] Keyboard normal hit against Case target still deals 7.
- [ ] Drum Sticks normal hit against Case target still deals 6.
- [ ] Critical damage is still not reduced by defender Case.
- [ ] Case still does not reduce knockback.
- [ ] Case still does not increase HP.
- [ ] Case still does not add guard / just guard.

### Amp balance check

- [ ] Amp-compatible fighters still get small reach bonus.
- [ ] Amp reach bonus remains +24px.
- [ ] Amp still does not increase damage.
- [ ] Amp still does not change knockback.
- [ ] Amp still does not change cooldown.
- [ ] Amp still does not change movement speed.
- [ ] Amp still does not create projectile.
- [ ] Amp still does not create multi-hit.
- [ ] Drum Sticks + Amp still resolves safely to none before battle behavior.

### Pick check

- [ ] Pick remains selectable/displayed.
- [ ] Pick full label is `ピック（準備中）` where full equipment display text is shown.
- [ ] Pick short label is `ピック` in compact HUD/list rows.
- [ ] Pick still has no gameplay effect.
- [ ] Pick does not change damage.
- [ ] Pick does not change range.
- [ ] Pick does not change critical rate.
- [ ] Pick does not change defense.
- [ ] Pick does not trigger fallback to none.
- [ ] Pick does not add records/analytics.

### Flow / UI check

- [ ] Equipment Select still opens.
- [ ] Drum Sticks + Amp can still be selected in Equipment Select.
- [ ] Drum Sticks + Amp incompatibility note is shown (`ドラムスティックはアンプ非対応。バトルでは装備なし扱い。`) when relevant.
- [ ] Battle HUD still displays equipment labels.
- [ ] ResultScene still opens.
- [ ] ResultScene still displays equipment labels.
- [ ] `R` rematch still works.
- [ ] `C` return still works.
- [ ] CPU mode still works.
- [ ] One attack can still hit only once.
- [ ] Critical hit still shows `クリティカル！` when effects are enabled.
- [ ] With effects disabled, critical damage still applies without crash.

### Records / storage check

- [ ] records schema is unchanged.
- [ ] settings schema is unchanged.
- [ ] no critical count records are added.
- [ ] no damage dealt records are added.
- [ ] no equipment usage analytics are added.
- [ ] no equipment win-rate analytics are added.
- [ ] Reset Preferences still resets equipment to `none`.

**Next recommended task:** Phase 10-19: Phase 10 prototype checkpoint docs.

## Phase 10-JP Japanese UI playtest checklist

Checkpoint note:

- This checklist is the primary manual verification checklist for the Phase 10-JP checkpoint.
- Use this checklist before starting Phase 11 polish tasks.
- If a check fails, create a small follow-up issue/PR instead of mixing fixes into checkpoint docs.

### 1) Main flow check

- [ ] Home opens normally.
- [ ] Home shows `はじめる` / `記録` / `設定`.
- [ ] Mode Select opens from Home.
- [ ] Mode Select shows `対戦モード選択`.
- [ ] Character Select opens from Mode Select.
- [ ] Character Select shows `キャラ選択`.
- [ ] Equipment Select opens from Character Select.
- [ ] Equipment Select shows `装備選択`.
- [ ] Battle starts from Equipment Select.
- [ ] Battle HUD shows `P1装備` / `P2装備`.
- [ ] ResultScene opens after match end.
- [ ] ResultScene shows `試合結果`.
- [ ] ResultScene can rematch with `R`.
- [ ] ResultScene can return to Character Select with `C`.
- [ ] ResultScene can return Home with `Enter/Space`.

### 2) Japanese label consistency check

- [ ] Fighter names are Japanese: `エレキギター` / `ベース` / `ドラムスティック` / `キーボード`.
- [ ] Equipment names are Japanese: `装備なし` / `アンプ` / `ピック（準備中）` / `ケース`.
- [ ] Compact equipment labels are Japanese: `なし` / `アンプ` / `ピック` / `ケース`.
- [ ] Character Select stats show `移動速度` / `攻撃力` / `ふっとばし`.
- [ ] Options shows `設定` / `演出` / `画面揺れ` / `設定リセット`.
- [ ] Records shows `記録` / `試合数` / `P1勝利` / `P2勝利` / `引き分け` / `記録リセット`.
- [ ] Pause overlay shows `一時停止 / 操作確認`.

### 3) Equipment explanation check

- [ ] Pick full display says `ピック（準備中）`.
- [ ] Pick description says it has no Phase 10 effect.
- [ ] Pick remains selectable.
- [ ] Pick still has no gameplay effect.
- [ ] Amp description says it supports Electric Guitar / Bass / Keyboard and extends reach slightly.
- [ ] Drum Sticks + Amp shows `ドラムスティックはアンプ非対応。バトルでは装備なし扱い。`.
- [ ] Drum Sticks + Amp still resolves safely in battle.
- [ ] Case description says normal damage is reduced.
- [ ] Case description says critical is not reduced.
- [ ] Drum Sticks description mentions high critical.
- [ ] Drum Sticks + Case description/tradeoff is understandable.

### 4) Battle behavior guardrail check

- [ ] One attack can still hit only once.
- [ ] Amp still only changes reach.
- [ ] Amp does not change damage.
- [ ] Amp does not add projectile or multi-hit.
- [ ] Case still reduces normal incoming damage.
- [ ] Case does not reduce critical damage.
- [ ] Drum Sticks critical still displays `クリティカル！`.
- [ ] `会心！` is not used as final runtime/player-facing critical wording.
- [ ] Pick still has no gameplay effect.
- [ ] No new records/settings fields are created.

### 5) Mode / menu behavior check

- [ ] Home navigation still works.
- [ ] Mode Select still switches 2P / CPU correctly.
- [ ] Character Select P1 `A/D` still works.
- [ ] Character Select P2 `←/→` still works.
- [ ] Character Select P2`↓` still toggles 2P / CPU.
- [ ] Equipment Select `↑/↓` still switches P1/P2 row.
- [ ] Equipment Select `←/→` still changes equipment.
- [ ] Options toggles still work.
- [ ] Options reset confirmation still works.
- [ ] Records reset confirmation still works.
- [ ] Pause `P` toggles pause/resume.
- [ ] CPU mode still plays.

### 6) Storage/schema check

- [ ] Existing settings load without crash.
- [ ] Existing records load without crash.
- [ ] Reset settings still works.
- [ ] Reset records still works.
- [ ] No records/settings schema changes.
- [ ] Internal IDs remain English: `none` / `amp` / `pick` / `case` / `electric-guitar` / `bass` / `drum-sticks` / `keyboard` / `human` / `cpu`.

## Phase 11-15 Japanese UI layout playtest checklist

Checkpoint note:

- Use this checklist after the Phase 11 Japanese UI layout work and before the Phase 11 checkpoint docs.
- Check each scene at 800x600, a laptop-sized viewport, and a large desktop viewport when possible.
- If a check fails, file or prepare a focused follow-up instead of mixing runtime fixes into this docs-only checklist PR.

### 1) General viewport checks

- [ ] 800x600 minimum viewport remains readable.
- [ ] Laptop-sized viewport remains readable.
- [ ] Large desktop viewport uses space safely and does not look trapped in an old 800x600 island.
- [ ] No upper-left / clipped / offscreen UI regression appears.
- [ ] Japanese text does not overflow, overlap, or collide with adjacent UI.
- [ ] Footer controls remain visible and separated from main content.

### 2) HomeScene

- [ ] Game title is readable and visually dominant.
- [ ] Main menu cards are readable.
- [ ] Selected menu item is visually obvious.
- [ ] `Enter` / `Space` activates the selected menu item.
- [ ] Records navigation works.
- [ ] Options navigation works.

### 3) ModeSelectScene

- [ ] VS CPU and 2P local options are readable.
- [ ] Selected mode is visually obvious.
- [ ] Mode descriptions are readable.
- [ ] `Enter` / `Space` proceeds to Character Select.
- [ ] `Esc` returns to Home.

### 4) CharacterSelectScene

- [ ] P1 and P2 cards are fully visible.
- [ ] Fighter names are readable, including `ドラムスティック`.
- [ ] Fighter descriptions are readable.
- [ ] Stats are readable and stay inside the cards.
- [ ] The previous upper-left huge/clipped regression does not return.
- [ ] Transition to EquipmentSelectScene works.

### 5) EquipmentSelectScene

- [ ] P1/P2 character labels are readable.
- [ ] Equipment list is readable.
- [ ] Equipment descriptions are readable.
- [ ] `none` / `Amp` / `Case` / `Drum Sticks` equipment/fighter combinations display correctly (`装備なし` / `アンプ` / `ケース` / Drum Sticks compatibility notes).
- [ ] Incompatible or unavailable notes remain readable.
- [ ] Selected player state is clear.
- [ ] Transition to BattleScene works.

### 6) BattleScene HUD

- [ ] P1 HP bar is visible.
- [ ] P2 HP bar is visible.
- [ ] Equipment labels are visible.
- [ ] Always-visible instruction text is short and readable.
- [ ] CPU mode does not show unnecessary P2 manual controls as primary information.
- [ ] 2P mode controls remain understandable.
- [ ] The HP/HUD disappearance regression does not return.

### 7) Pause / Quick Help

- [ ] Opens with `P`.
- [ ] Closes/resumes with `P`.
- [ ] P1 controls are readable.
- [ ] CPU mode explanation is readable.
- [ ] 2P mode controls are readable.
- [ ] Overlay does not clip at 800x600.

### 8) ResultScene

- [ ] Result title is readable.
- [ ] P1/P2 summary is readable.
- [ ] Equipment labels are readable.
- [ ] Next-action controls are readable.
- [ ] `R` rematch works.
- [ ] `C` character select works.
- [ ] `Enter` / `Space` returns Home.
- [ ] Known ResultScene visual bug remains tracked as deferred for later full-screen/global layout cleanup.

### 9) RecordsScene

- [ ] Records summary is readable.
- [ ] Last played text is readable or truncated safely.
- [ ] Reset confirmation text is readable.
- [ ] Home and reset controls work.
- [ ] Records area and control area do not overlap.

### 10) OptionsScene

- [ ] Setting rows are readable.
- [ ] Selected row is visually obvious.
- [ ] ON/OFF values are clear.
- [ ] Reset confirmation text is readable.
- [ ] Settings still persist as before.
- [ ] `Esc` returns Home.

### 11) Regression guardrails

- [ ] No gameplay values changed.
- [ ] No hitbox or hurtbox changes were introduced.
- [ ] No fighter stat changes were introduced.
- [ ] No equipment effect changes were introduced.
- [ ] No records/settings schema changes were introduced.
- [ ] No scene flow changes occur except expected UI navigation.

### Known deferred issues

- ResultScene has a known visual bug that remains deferred for later full-screen/global layout cleanup.
- Final full-screen/global layout cleanup may revisit ResultScene layout and Battle HUD visual polish later.
- Do not treat this checklist update as approval to implement Guard, Just Guard, Timer, Round rules, Retire, Pick effects, new fighters, audio, images, 3D, or external assets.


## Phase 12-1 scope docs checklist

- [ ] Phase 12 goals are documented for Guard, Just Guard, Timer, Retire / Forfeit, time-up result, and match-rule direction.
- [ ] Initial defaults are documented: P1 Guard `S`, P2 Guard Down arrow, 65% guard movement, 50% normal Guard damage/knockback, 120ms Just Guard window, 99-second timer, pause stops timer, higher HP wins on time up, equal HP is Draw.
- [ ] Round system is documented as deferred.
- [ ] Result reason direction is documented for KO / TIME_UP / RETIRE / DRAW.
- [ ] Records v1 direction is documented to reuse existing win/loss/draw/match counters without reason-specific saved counters.
- [ ] Phase 12 non-goals forbid attack tempo changes, hitbox/hurtbox tuning, fighter stat changes, Pick effects, new fighters, online play, 3D, audio, images, external assets, and records/settings schema migration.
- [ ] Phase 11 UI guardrails are carried forward: HP bars visible, Character Select layout stable, footer controls visible, and Japanese UI readable.
- [ ] No runtime code is modified by Phase 12-1.

**Next recommended task:** Phase 12-2: Guard input and guard state foundation.


## Phase 12-2 Guard input/state foundation checklist

- [ ] P1 Guard input is wired to `S` in BattleScene.
- [ ] P2 Guard input is wired to Down arrow in local 2P BattleScene.
- [ ] Guard state uses clear internal runtime fields such as `isGuarding` and `guardStartedAt`.
- [ ] Pressing/releasing Guard updates runtime state without changing damage, knockback, movement speed, attack timing, hitboxes, fighter stats, equipment effects, records, or settings.
- [ ] CPU mode still plays without P2 manual Guard behavior.
- [ ] Existing Phase 11 UI guardrails still pass: HP bars visible, footer controls visible, and Japanese UI readable.

**Next recommended task:** Phase 12-3: Normal Guard damage/knockback reduction.


## Phase 12-3 Normal Guard damage/knockback checklist

- [ ] A guarding defender takes about 50% final damage after existing base damage, Case, and critical calculations.
- [ ] Guarded positive damage remains at least 1.
- [ ] A guarding defender receives about 50% knockback.
- [ ] Normal Guard reduces both normal hits and critical hits without changing critical chance or multiplier.
- [ ] Non-guard hits behave as before.
- [ ] Guard does not change movement speed or attack-start behavior yet.
- [ ] Case, Amp, Drum Sticks critical, Pick preparation behavior, records, settings, KO, and pause behavior remain unchanged.

**Next recommended task:** Phase 12-4: Guard movement and attack-start lockout while guarding.


## Phase 12-4 Guard movement / attack lockout checklist

- [ ] P1 holding `S` moves at about 65% normal speed.
- [ ] P2 holding Down arrow in local 2P moves at about 65% normal speed.
- [ ] P1 cannot start a new attack with `W` or `Space` while holding `S`.
- [ ] P2 cannot start a new attack with Up arrow or `Enter` while holding Down arrow.
- [ ] Releasing Guard restores normal movement speed and attack-start behavior.
- [ ] Existing active attacks are not canceled just because Guard is pressed after they started.
- [ ] CPU mode still works normally and does not gain CPU Guard AI.
- [ ] Guard damage/knockback reduction from Phase 12-3 still works.
- [ ] Attack cooldown, duration, active hitboxes, fighter stats, equipment behavior, records, settings, pause, and KO behavior are unchanged.

**Next recommended task:** Phase 12-5: Just Guard timing window and successful block behavior.


## Phase 12-5 Just Guard timing / successful block checklist

- [ ] Pressing Guard within the 120ms window before impact causes Just Guard.
- [ ] Just Guard causes 0 damage.
- [ ] Just Guard causes 0 knockback.
- [ ] Holding Guard too early falls back to Normal Guard behavior after the 120ms window.
- [ ] Releasing and pressing Guard again starts a fresh 120ms Just Guard window.
- [ ] Normal Guard damage/knockback reduction still works outside the Just Guard window.
- [ ] Non-guard hits behave as before.
- [ ] Case, Amp, Drum Sticks critical, Pick preparation behavior, records, settings, pause, KO, and CPU behavior remain unchanged.
- [ ] No Guard / Just Guard HUD or visual feedback is required until Phase 12-6.

**Next recommended task:** Phase 12-6: Guard / Just Guard visual and HUD feedback.


## Phase 12-6 Guard / Just Guard feedback checklist

- [ ] P1 holding `S` shows a subtle Guard visual state.
- [ ] P2 holding Down arrow in local 2P shows a subtle Guard visual state.
- [ ] Guard visual disappears when Guard is released.
- [ ] Just Guard success shows distinct short visual feedback that is clearly different from Normal Guard.
- [ ] Just Guard success does not show misleading `HIT -0`, `CRITICAL 0`, or normal damage-style feedback.
- [ ] Normal Guard still shows reduced-damage hit feedback when useful.
- [ ] Non-guard hits and non-guard critical hits still show ordinary hit feedback.
- [ ] Guard / Just Guard numerical behavior remains unchanged.
- [ ] No audio, images, 3D, external assets, Timer, Time Up, Retire, Result reason, records/schema, or CPU Guard AI changes are included.
- [ ] Long-term polish direction remains less text and more sound, timing, light, shape, hit effect, animation, and other non-verbal game-feel feedback.

**Next recommended task:** Phase 12-7: 99-second timer foundation.


## Phase 12-7 99-second timer foundation checklist

- [ ] BattleScene shows a clear center-top timer.
- [ ] Timer initializes at `99`.
- [ ] Timer starts counting down only after the match starts, not during Ready/Fight startup delay.
- [ ] Timer counts down during active battle.
- [ ] Timer display clamps at `0` and does not visually go below 0.
- [ ] Time Up does not end the match yet; winner/draw-by-HP behavior remains deferred to Phase 12-8.
- [ ] Timer does not overlap P1/P2 HP bars or footer controls at 800x600, laptop-sized viewport, or large desktop viewport.
- [ ] Guard / Just Guard, KO, CPU battle, equipment behavior, records, settings, and attack/hitbox values remain unchanged.

**Next recommended task:** Phase 12-8: Timer pause behavior and time-up result logic.


## Phase 12-8 Timer pause / Time Up checklist

- [ ] Timer still starts at `99` and counts down only after the match starts.
- [ ] Timer does not count down during Pause.
- [ ] Timer resumes after unpause.
- [ ] Timer does not count down after match over.
- [ ] Timer reaching `0` ends the match once.
- [ ] Time Up with P1 HP higher gives an existing P1 win result.
- [ ] Time Up with P2 HP higher gives an existing P2 win result.
- [ ] Time Up with equal HP gives an existing draw result.
- [ ] KO before Time Up still works normally.
- [ ] Records continue to use existing P1/P2/draw and CPU/local counters without reason-specific schema changes.
- [ ] Guard / Just Guard, CPU battle, equipment behavior, attack timing, hitboxes, fighter stats, Result reason UI, and Retire / Forfeit remain unchanged.

**Next recommended task:** Phase 12-9: Result reason handoff/display for KO / TIME_UP / RETIRE / DRAW without records schema expansion.


## Phase 12-9 Result reason handoff/display checklist

- [ ] KO result passes and displays a `KO` reason label.
- [ ] Time Up result passes and displays a `TIME UP` reason label.
- [ ] Draw result passes and displays a clear draw reason label when appropriate.
- [ ] `RETIRE` is available as a transient reason label/type for Phase 12-10, but Retire / Forfeit behavior is not implemented yet.
- [ ] ResultScene still shows the correct winner/draw title.
- [ ] Records continue to use existing P1/P2/draw and CPU/local counters; no reason-specific counters or schema changes are added.
- [ ] Time Up HP comparison, KO behavior, Guard / Just Guard, CPU battle, equipment behavior, attack timing, hitboxes, fighter stats, and settings remain unchanged.

**Next recommended task:** Phase 12-10: Pause menu Retire / Forfeit confirmation flow.


## Phase 12-10 Pause Retire / Forfeit checklist

- [ ] Pause opens with `P` during battle.
- [ ] While paused, pressing `1` once enters P1 Retire confirmation.
- [ ] Pressing `1` again confirms P1 Retire, gives P2 the existing win result, and displays `RETIRE` on ResultScene.
- [ ] While paused, pressing `2` once enters P2 Retire confirmation.
- [ ] Pressing `2` again confirms P2 Retire, gives P1 the existing win result, and displays `RETIRE` on ResultScene.
- [ ] Pressing `P` from normal Pause or Retire confirmation cancels/unpauses cleanly and clears pending confirmation.
- [ ] Timer does not tick while Pause / Retire confirmation is open.
- [ ] Records continue to use existing P1/P2 win counters; no reason-specific counters or schema changes are added.
- [ ] KO and Time Up result flows still work normally.
- [ ] Guard / Just Guard, CPU battle, equipment behavior, attack timing, hitboxes, fighter stats, and settings remain unchanged.

**Next recommended task:** Phase 12-11: Records/settings schema sanity check.


## Phase 12-11 Records/settings schema sanity checklist

- [ ] `finishMatchByTimeUp()` has exactly one implementation.
- [ ] `getTimeUpResultData()` has exactly one implementation.
- [ ] KO P1/P2 wins and KO draws update existing P1/P2/draw counters only.
- [ ] Time Up P1/P2 wins and equal-HP draws update existing P1/P2/draw counters only.
- [ ] P1 Retire updates the existing P2 win counter; P2 Retire updates the existing P1 win counter.
- [ ] CPU matches and local 2P matches continue using existing match-type counters.
- [ ] `matchEndReason` remains transient ResultScene display data and does not add reason-specific records fields.
- [ ] Existing records/settings saved data loads without migration.
- [ ] No records/settings schema fields, localStorage keys, or version migrations are added.
- [ ] Guard / Just Guard, Timer, Time Up, Retire, Result reason display, CPU battle, equipment behavior, attack timing, hitboxes, and fighter stats remain unchanged.

**Next recommended task:** Phase 12-12: Manual playtest checklist update.


## Phase 12-12 Consolidated Guard / Timer / Retire manual playtest checklist

Use this consolidated checklist before Phase 12 checkpoint docs. Run the checks in both VS CPU and local 2P where applicable, and keep Phase 11 viewport/readability guardrails in mind throughout.

### Guard / Normal Guard

- [ ] P1 can hold `S` to enter Guard.
- [ ] P2 can hold Down arrow to enter Guard in local 2P.
- [ ] Guard visual appears while the player is guarding.
- [ ] Guard visual disappears when Guard is released.
- [ ] Normal Guard reduces incoming damage.
- [ ] Normal Guard reduces incoming knockback.
- [ ] Guarding slows movement.
- [ ] Guarding prevents starting a new attack.
- [ ] Releasing Guard restores normal movement speed and normal attack-start behavior.
- [ ] CPU battle still works without CPU Guard AI.

### Just Guard

- [ ] Pressing Guard shortly before impact triggers Just Guard.
- [ ] Just Guard causes 0 damage.
- [ ] Just Guard causes 0 knockback.
- [ ] Just Guard visual feedback appears and is distinct from Normal Guard.
- [ ] Just Guard does not show misleading damage text such as `0` or `CRITICAL 0`.
- [ ] Holding Guard too early falls back to Normal Guard.
- [ ] Releasing and re-pressing Guard starts a fresh Just Guard window.
- [ ] Non-guard hits still behave normally.

### Timer / Time Up

- [ ] Timer appears near the center-top HUD.
- [ ] Timer starts at `99`.
- [ ] Timer does not count down before match start.
- [ ] Timer counts down during active battle.
- [ ] Timer pauses while Pause is open.
- [ ] Timer resumes after unpause.
- [ ] Timer clamps at `0` and does not display a negative value.
- [ ] Time Up with P1 HP higher gives P1 win.
- [ ] Time Up with P2 HP higher gives P2 win.
- [ ] Time Up with equal HP gives draw.
- [ ] KO before Time Up still works normally.

### Result reasons

- [ ] KO result displays `KO`.
- [ ] Time Up result displays `TIME UP`.
- [ ] Retire result displays `RETIRE`.
- [ ] Draw result displays a clear draw/result reason.
- [ ] ResultScene still shows the correct winner/draw title.
- [ ] ResultScene remains readable at 800x600, laptop-sized viewport, and large desktop viewport.

### Retire / Forfeit

- [ ] Press `P` during battle to pause.
- [ ] While paused, pressing `1` once enters P1 Retire confirmation.
- [ ] Pressing `1` again confirms P1 Retire.
- [ ] P1 Retire gives P2 win.
- [ ] While paused, pressing `2` once enters P2 Retire confirmation.
- [ ] Pressing `2` again confirms P2 Retire.
- [ ] P2 Retire gives P1 win.
- [ ] Pressing `P` from Retire confirmation cancels/unpauses cleanly.
- [ ] Timer does not tick during Pause or Retire confirmation.
- [ ] Retire cannot trigger repeatedly after match over.

### Records / settings schema

- [ ] KO P1/P2 wins update existing P1/P2 win counters.
- [ ] KO draw/double KO updates the existing draw counter.
- [ ] Time Up P1/P2 wins update existing P1/P2 win counters.
- [ ] Time Up equal HP updates the existing draw counter.
- [ ] P1 Retire updates the existing P2 win counter.
- [ ] P2 Retire updates the existing P1 win counter.
- [ ] CPU matches update the existing CPU match counter.
- [ ] Local 2P matches update the existing local match counter.
- [ ] No reason-specific records counters exist.
- [ ] Existing saved records/settings load without migration.
- [ ] No new localStorage keys or schema migrations are introduced.

### Phase 11 UI regression checks

Check these at 800x600, laptop-sized viewport, and large desktop viewport:

- [ ] HP bars remain visible.
- [ ] Battle HUD does not overlap badly with the timer.
- [ ] Character Select does not regress to the previous upper-left/clipped layout.
- [ ] Footer controls remain visible.
- [ ] Japanese UI text remains readable.
- [ ] Home remains usable.
- [ ] Mode Select remains usable.
- [ ] Character Select remains usable.
- [ ] Equipment Select remains usable.
- [ ] Battle remains usable.
- [ ] Result remains usable.
- [ ] Records remains usable.

### Combat non-regression

- [ ] Attack timing feels unchanged from before Phase 12-12.
- [ ] Hitboxes/hurtboxes are not changed.
- [ ] Fighter stats are not changed.
- [ ] Equipment behavior is not changed.
- [ ] Pick behavior is not changed.
- [ ] Guard may still feel underused due to fast attack tempo, but no tuning is included in Phase 12-12.
- [ ] Attack tempo review remains deferred to Phase 13.

**Next recommended task:** Phase 12-13: Phase 12 checkpoint docs.


## Phase 12 checkpoint reference

Phase 12 checkpoint status and deferred Phase 13 direction are summarized in `docs/phase-12-checkpoint-report.md`. Complete the consolidated Phase 12 checklist above before treating the checkpoint as manually verified.
