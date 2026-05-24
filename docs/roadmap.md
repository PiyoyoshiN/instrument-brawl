# Roadmap

## Current status

Instrument Brawl is currently a simple browser-playable local 1v1 prototype built with Phaser, Vite, and TypeScript.

- Current selectable fighters: Electric Guitar, Bass, Drum Sticks, and Keyboard.
- CharacterSelectScene lets both players choose from the fighter registry.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R starts a rematch from the result screen.
- C returns from ResultScene to CharacterSelectScene with selected fighter IDs preserved.
- HP bars, clearer HP text, hit flash, visible-duration attack hit detection, one-hit-per-attack behavior, velocity-based knockback, win detection, draw detection, Home -> ModeSelect -> CharacterSelect -> Battle -> Result scene flow, clearer result screen, scene cleanup safeguards, final Phase 2 balance tuning, fighter registry, scene-data fighter ID handoff, minimal character select, and character select readability/stat display polish are implemented.

## Completed

### Phase 1: playable prototype — complete

Goal: make the smallest fun version of the game.

- Create a browser-playable local 1v1 match.
- Add one arena.
- Add Electric Guitar and Bass as fixed starter fighters.
- Add simple movement for both players.
- Add one attack for each fighter.
- Add HP, damage, knockback, and win/loss detection.
- Add a quick restart flow.
- Add GitHub Pages deployment setup.

### Phase 2: better game feel — complete

Goal: make the prototype funnier and more satisfying without making it complex.

Completed steps:

- Phase 2-1: Attack hit detection is active during the visible attack duration, while one attack still hits only once.
- Phase 2-2: Knockback uses simple velocity-based movement.
- Phase 2-3: Hit feedback flash is implemented.
- Phase 2-4: Electric Guitar and Bass have light stat differences.
- Phase 2-5: Guitar and Bass have different attack hitbox sizes/shapes.
- Phase 2-6: Simple HP bars and clearer HP text are implemented.
- Phase 2-7: Basic HomeScene -> BattleScene -> ResultScene flow is implemented.
- Phase 2-8: Result screen and match-end readability polish is implemented.
- Phase 2-9: Scene state reset and cleanup safeguards are implemented.
- Phase 2-10: Final Guitar and Bass balance tuning is implemented.

Current implemented fighter tuning:

| Fighter | HP | Move speed | Damage | Knockback speed | Attack style |
| --- | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | 100 | 260 | 10 | 520 | Faster standard fighter with a sharper horizontal attack hitbox |
| Bass | 105 | 230 | 10 | 580 | Slower heavier fighter with a taller/heavier attack hitbox |
| Drum Sticks | 80 | 310 | 8 | 420 | Lightweight fast fighter with short reach |
| Keyboard | 95 | 215 | 9 | 500 | Wide awkward area-control fighter with a broad body and long reach |

### Phase 2.5: future expansion preparation — complete

Goal: prepare the project for future expansion without adding new gameplay content yet.

Completed steps:

- Phase 2.5-1: Fighter definitions are organized for safer future character expansion.
- Phase 2.5-2a: BattleScene shows a short Ready/Fight prompt before movement and attacks begin.
- Phase 2.5-2b: Simple fighter registry is implemented for future expansion.
- Phase 2.5-3: BattleScene can receive P1/P2 fighter IDs through scene data.
- Phase 2.5-4: A minimal CharacterSelectScene is implemented using the fighter registry and initially exposed Electric Guitar and Bass.
- Phase 2.5-5: ResultScene can return to CharacterSelectScene with selected fighter IDs preserved.
- Phase 2.5-6: CharacterSelectScene readability is improved with clearer selected fighter labels and lightweight HP, Speed, Damage, and Knockback stat display.

## Phase 3: core band 4 fighters — complete

Goal: expand the selectable roster to the core band set while keeping each fighter simple, funny, and readable. This goal is complete.

Core band fighters:

1. Electric Guitar — already implemented.
2. Bass — already implemented.
3. Drum Sticks — implemented in Phase 3-2.
4. Keyboard — implemented in Phase 3-6 with a wider 112 x 70 body and area-control reach.

Completed steps:

- Phase 3-2: Drum Sticks is implemented as a lightweight fast fighter with short reach, low HP, lower damage, and lower knockback.
- Phase 3-3: CharacterSelectScene is polished for the current three-fighter roster with clearer fighter count and selected index display.
- Phase 3-4: Drum Sticks receives a light balance sanity pass; stats remain unchanged pending more playtest feedback.
- Phase 3-5: Optional per-fighter body dimensions are prepared for future fighters like Keyboard while existing fighters keep the default 72 x 120 body.
- Phase 3-6: Keyboard is implemented as the fourth core band fighter with wide body dimensions, awkward slower movement, and a broad one-hit attack.
- Phase 3-7: The four-fighter roster receives a light sanity pass; current values are kept because the fighters remain readable, distinct, and playable.
- Phase 3-8: Phase 3 completion is documented and future work is directed toward Phase 4 presentation/polish.

Phase 3 completion summary:

- Fighter registry, CharacterSelectScene, BattleScene scene-data handoff, ResultScene rematch, and ResultScene return-to-character-select support all four core fighters.
- Phase 3 kept one attack per fighter, one attack hitting only once, simple rectangle prototype visuals, local 1v1 only, and same-character selection allowed.
- Phase 3 intentionally avoided CPU, BGM/SE, story, encyclopedia, progression, specials, items, timer, rounds, retire button, and new non-core fighters.

Later candidate ideas only, not Phase 3 fighters:

- Microphone.
- Piano.
- Bongo.
- Tambourine.

## Phase 4: solo play preparation, presentation, and audio-ready planning

Goal: make the completed core loop easier to play alone, clearer to read, and ready for later presentation/audio work without adding audio assets yet.

Phase 4 is not only visual polish. It includes solo play preparation, presentation/polish, and audio-ready structure planning.

Early Phase 4 priorities:

- Phase 4-1: Define Phase 4 scope and guardrails.
- Phase 4-2: Design minimal P1 vs CPU mode before implementation.
- Phase 4-3: Implement minimal P2 CPU mode for solo play while preserving local 2-player as the default.
- Phase 4-4: CPU sanity pass keeps local 2-player unchanged and lightly tunes CPU comfort distance so short-reach CPU fighters do not stop just outside attack range.
- Phase 4-7: Light menu visual polish improves Home, Character Select, and Result readability without changing controls or scene flow.
- Phase 4-8: Light arena visual polish improves BattleScene floor separation, background lines, and fighter grounding while keeping rectangle visuals.
- Phase 4-9: Light hit and result effects polish adds small text/rectangle feedback while preserving damage, one-hit attacks, and ResultScene flow.
- CharacterSelectScene defaults to P2 Human mode and allows choosing P2 Human or CPU.
- Match scene data preserves `player2Mode` (`human` or `cpu`) from CharacterSelectScene to BattleScene to ResultScene.
- ResultScene R rematch and C return-to-character-select preserve selected fighters and P2 Human/CPU mode.
- The first CPU stays simple: control P2 only, wait for Ready/Fight, stop after matchOver, approach P1 when far away, attack when close enough, and optionally back away sometimes.
- CPU uses existing fighter stats and existing attack cooldown, attack duration, one-hit-per-attack rule, HP, hit flash, knockback, win/draw detection, and ResultScene flow.
- Do not add difficulty settings, learning AI, strong prediction, perfect avoidance, or CPU-only stat changes yet.
- Improve menus, arena readability, hit/win/restart feedback, and comedic presentation details in small focused PRs.

Audio guardrails:

- Phase 4-6: Document audio policy without adding audio assets.
- Do not add BGM/SE audio files yet.
- Later Phase 4 work may prepare an audio-ready structure such as `public/assets/audio/bgm` and `public/assets/audio/sfx`.
- Future audio sources must be safe for a public GitHub repository, such as self-made audio, CC0 assets, or properly credited licensed assets such as CC-BY when credits are handled.
- Do not commit commercial songs, existing game BGM, YouTube audio, unclear-license files, or ear-copy recreations of copyrighted tracks.
- Future lightweight audio settings may include `soundEnabled` and `masterVolume`, but do not build a full settings screen yet.

Early Phase 4 non-goals:

- New fighters.
- Specials, items, progression, story, encyclopedia, timer, rounds, or retire button.
- Over-normalizing fighter differences.
- Large mixed-scope PRs; keep 1 PR = 1 feature.

## Phase 4-10 checkpoint

Phase 4 checkpoint status is documented after the solo-play and light-presentation pass.

Implemented at this checkpoint:

- Four selectable fighters: Electric Guitar, Bass, Drum Sticks, and Keyboard.
- Local 2P remains the default.
- Optional P2 CPU mode is available from CharacterSelectScene.
- P2 Human/CPU mode is preserved through BattleScene, ResultScene, R rematch, and C return-to-character-select.
- Minimal CPU behavior and the CPU sanity pass are implemented.
- Audio policy is documented without audio assets.
- Light menu polish, arena polish, and hit/result feedback polish are implemented.

Still intentionally avoided:

- New fighters.
- Specials, items, progression, story, encyclopedia, timer, rounds, or retire button.
- BGM/SE audio files.
- Settings screen.
- Online play.

Phase 5 checkpoint follow-ups from this note are complete: ResultScene subtitle wording is now `Match finished`, and Pause / Quick Help is implemented as a compact in-battle overlay.

Next recommended direction: move to Phase 6 effects trial and presentation experiments.

## Phase 5: foundation cleanup and roadmap alignment — checkpoint complete

Goal: prepare the project for future phases without expanding gameplay. Phase 5 is not a gameplay expansion phase.

Checkpoint summary:

- Foundation cleanup and roadmap alignment updates were completed.
- ResultScene subtitle wording is polished to `Match finished`.
- Compact in-battle Pause / Quick Help is implemented with `P` (not a full tutorial).
- Manual playtest checklist is documented at `docs/playtest-checklist.md`.
- Audio-ready folder structure exists at `public/assets/audio/bgm/.gitkeep` and `public/assets/audio/sfx/.gitkeep` with no BGM/SE assets.

Phase 5 guardrails:

- Do not add a full tutorial yet.
- Keep Pause / Quick Help compact and in-battle; do not expand it into a full tutorial system.
- Do not add new fighters, specials, items, progression, story, encyclopedia, timer, rounds, retire button, settings screen, online play, or BGM/SE assets.
- Keep PRs focused: 1 PR = 1 feature.

### Pause / Quick Help planning

- Quick Help should be a compact in-battle overlay, not a full tutorial.
- Proposed toggle key: `P`, because current controls do not use it.
- One-screen content should include Resume `P`, P1 controls, P2 Human controls, P2 CPU automatic control, current P2 mode, one-hit attack rule, Ready / Fight reminder, and Result controls.
- Later pause behavior should stop movement, new attacks, CPU behavior, and active attack updates.
- Later pause behavior must not break Ready / Fight, `matchOver`, ResultScene transition, R rematch, or C return-to-character-select.
- Forfeit / Retire, Timer, Rounds, Practice mode, TutorialScene, and Settings are not part of this task.


Phase 6 trial design details are documented in `docs/phase-6-effects-trial.md`.


## Phase 6 checkpoint

Phase 6 effects trial/presentation experiments are complete as a checkpoint.

Implemented in Phase 6:

- 6-2 Attack visual color variation.
- 6-3 Small primitive hit spark.
- 6-4 `HIT -damage` marker enhancement with `CLEAN HIT` sub-label.
- 6-5 Tiny camera shake on confirmed hit.
- 6-6 Small primitive win/draw effect at match end.

These remain visual-only trial effects under Phase 6 guardrails; gameplay values/logic were not expanded.

Next recommended direction: Phase 7 checkpoint is complete; move to Phase 8 planning starting with Phase 8-2 scope definition.

Future hook note: later combat/effects work can introduce planned `impactClass` / `attackMethod` categories (`direct-heavy`, `direct-medium`, `direct-light`, `sonic`, `hybrid`) as implementation tasks.


## Phase 7-1: game shell and local save foundation scope

Phase 7 now has initial game-shell implementation plus ongoing save/options scope planning.

Phase 7 scope direction:

- Home -> Mode Select -> Character Select scene flow is now implemented.
- Mode Select now clearly offers Local 2P and P1 vs CPU before Character Select.
- Keep the current CharacterSelectScene P2 Human/CPU toggle for now.
- Plan localStorage-based preferences (no implementation yet).
- Plan save/load hooks for last selected P1 fighter, P2 fighter, and P2 mode.
- Plan effects ON/OFF preference.
- Plan screen shake ON/OFF preference.
- Plan lightweight Records foundation scope.
- Keep server saving deferred until real online/account features are considered.

Phase 7 non-goals at this step:

- No gameplay-value changes (HP/damage/knockback/cooldown/duration/hitbox/CPU/one-hit rule).
- No OptionsScene/localStorage/Records implementation yet.
- No equipment, amps, ranged/sonic attacks, guard/just-guard, critical damage, specials, items, new fighters, timer, rounds, story, encyclopedia, online, or server saving.
- No BGM/SE assets or playback.
- No images, sprites, or 3D.


## Phase 7-2: document game shell scene flow

Current implemented scene flow is now:

- `HomeScene -> ModeSelectScene -> CharacterSelectScene -> BattleScene -> ResultScene`

Current flow:

- `HomeScene -> ModeSelectScene -> CharacterSelectScene -> BattleScene -> ResultScene`

Scene roles (current + future scope):

- **HomeScene:** simple entrance with Start, Options, and possible future Records entry.
- **ModeSelectScene:** choose Local 2P or P1 vs CPU before Character Select.
  - Local 2P -> `player2Mode: "human"`
  - P1 vs CPU -> `player2Mode: "cpu"`
  - Starts CharacterSelectScene with `{ player2Mode }`.
  - Suggested controls: Up/Down or Left/Right choose highlight, Enter/Space confirm, Escape return Home.
  - Click/tap on a button also confirms that mode.
- **CharacterSelectScene:** choose fighters; keep current P2 Human/CPU toggle as fallback/manual override for now.
  - If Mode Select chose Local 2P, Character Select initially shows Human.
  - If Mode Select chose P1 vs CPU, Character Select initially shows CPU.
- **BattleScene:** continue receiving `player1FighterId`, `player2FighterId`, and `player2Mode` through scene data.
- **ResultScene:** continue preserving fighters and `player2Mode` through `R` rematch and `C` return-to-character-select.
- **OptionsScene (future):** later manage effects ON/OFF and screen shake ON/OFF.
- **Records (future):** lightweight foundation only, not full achievements/unlocks.

Current status: ModeSelectScene implementation is complete.
- Minimal `OptionsScene` shell exists with local Effects ON/OFF and Screen Shake ON/OFF toggles.
- Options preference toggles save to `preferences.effectsEnabled` and `preferences.screenShakeEnabled`.
- Preferences are applied to BattleScene presentation only (visual extras + tiny shake gating).
- Records planning notes were completed in Phase 7; runtime records were implemented in Phase 8.

Home Start routes to ModeSelectScene. Options and Records remain future entries.


### Phase 7-7: localStorage save foundation (design only)

Phase 7-7 was documentation-only. Phase 7-8 added utility helpers. Phase 7-9 saves confirmed selections. Phase 7-10 restores last selections to initial Mode/Character UI state.

Planned persisted fields:

- `lastSelected.player1FighterId`
- `lastSelected.player2FighterId`
- `lastSelected.player2Mode`
- `preferences.effectsEnabled`
- `preferences.screenShakeEnabled`

Suggested key/payload:

- key: `instrument-brawl:settings`
- payload: small JSON object with `version` for future migration support

Planned fallback behavior:

- localStorage unavailable -> use current in-memory defaults
- parse error/invalid shape -> ignore persisted payload and use defaults
- invalid fighter IDs -> replace with default fighter IDs
- invalid `player2Mode` -> use `"human"`

Integration timing (future implementation PRs):

- load on ModeSelectScene / CharacterSelectScene entry (implemented in Phase 7-10)
- save after confirmed selections and option changes (selection-save for Mode/Character confirm is now implemented)
- no server storage, no account sync, no Records persistence yet



### Phase 7-11: Options preferences scope (design only)

This step is documentation-only. No `OptionsScene` implementation, UI wiring, or runtime preference application is included yet.

Planned Options preferences:

- `preferences.effectsEnabled` (default `true`)
- `preferences.screenShakeEnabled` (default `true`)

Planned storage rules:

- Reuse existing key: `instrument-brawl:settings`
- Keep fallback to defaults when localStorage is unavailable/invalid
- Keep preferences local-only (no server/account sync)

Planned effect scope (future wiring):

- Effects OFF: disable visual-only extras like hit spark / `CLEAN HIT` / win-draw accent effects / other nonessential presentation effects
- Screen Shake OFF: disable tiny screen/camera shake only
- Screen Shake OFF must not disable other effects
- Effects OFF must not change gameplay values/logic
- BGM/SE settings remain out of scope until audio implementation exists
- Records preferences/storage remain out of scope



### Phase 7-14: lightweight Records foundation (design only)

This step is planning-only. No RecordsScene, no runtime records storage, and no Home menu wiring are added yet.

Planned Records principles:

- local-only and lightweight
- no gameplay impact
- no unlock dependency
- no online/account/server dependency

Candidate fields for later implementation:

- `totalMatches`, `p1Wins`, `p2Wins`, `draws`
- `cpuMatches`, `local2pMatches`
- `lastPlayedAt`
- optional later: per-fighter pick counts

Out of scope:

- achievements/trophies/unlocks
- encyclopedia/story completion metrics
- online rank/matchmaking/account stats
- detailed logs/per-hit analytics/damage history/replay data

Storage direction for later implementation:

- keep settings separate: `instrument-brawl:settings`
- prefer separate records key: `instrument-brawl:records`
- include `version` for migration
- sanitize invalid values and fallback to empty/default records when storage is unavailable/invalid


## Phase 7 checkpoint

Phase 7 checkpoint is complete.

- Game shell complete.
- Mode Select complete.
- Options complete.
- localStorage settings complete (`instrument-brawl:settings`).
- Records foundation docs complete.
- Records runtime is implemented in Phase 8 (separate records key, once-per-match save, RecordsScene, Reset Records).
## Phase 8 scope: Records / Reset / Match Rule & Equipment Planning

Phase 8 is not a major combat expansion phase.

### Phase 8 task list (8-1 to 8-17)

- 8-1 Phase 7 checkpoint docs — already complete
- 8-2 Phase 8 scope docs — this task
- 8-3 Reset preferences design docs — this task
- 8-4 Reset preferences implementation — complete
- 8-5 Records runtime design docs — this task
- 8-6 Records storage utility
- 8-7 Save match result once
- 8-8 RecordsScene shell — complete
- 8-9 Home Records entry — complete
- 8-10 Reset Records design docs — complete
- 8-11 Reset Records implementation — complete
- 8-12 Retire / Forfeit design docs — complete
- 8-13 Timer design docs — complete
- 8-14 Equipment / Amp design docs — this task
- 8-15 `attackMethod` / `impactClass` docs
- 8-16 Playtest checklist update
- 8-17 Phase 8 checkpoint docs

### Phase 8 implementation targets

- Reset Preferences
- Records localStorage utility
- Save match result once
- RecordsScene shell
- Home Records entry
- Reset Records
- Playtest checklist updates

### Phase 8 docs/design-only targets

- Retire / Forfeit
- Timer
- Equipment / Amp
- `attackMethod` / `impactClass`
- Critical rate / guard / just guard as future design topics only

### Phase 8 immediate non-goals

- No equipment implementation
- No amp/ranged/sonic attack implementation
- No critical damage/rate gameplay implementation
- No guard or just guard implementation
- No special moves
- No rounds
- No timer gameplay implementation
- No new fighters
- No encyclopedia implementation
- No story
- No online play
- No server saving
- No BGM/SE assets
- No images, sprites, or 3D

### Phase 8-3: Reset preferences design docs

Design rules:

- Reset Preferences resets settings only (`instrument-brawl:settings`)
- Do not modify/delete/read `instrument-brawl:records`
- Keep Reset Preferences separate from future Reset Records (no reset-all in this phase)

Reset defaults:

- P1 fighter: `electric-guitar`
- P2 fighter: `bass`
- P2 mode: `human`
- Effects: `true`
- Screen shake: `true`

Future UI behavior (OptionsScene):

- Separate Reset Preferences row/action
- Two-step confirmation (`Press again to confirm`)
- Escape or moving away cancels pending confirmation
- Keep implementation minimal; no modal system design in this phase

Expected post-reset behavior:

- Settings storage returns to defaults
- Mode Select restores default Human highlight
- Character Select restores default fighters unless scene data overrides
- Options restores Effects ON and Screen Shake ON
- Gameplay logic/values remain unchanged

Failure/fallback behavior:

- localStorage unavailable -> fail safely without crash
- remove/save failure -> fail safely without crash
- existing sanitize/default fallback remains active


### Phase 8-5: Records runtime design docs

Records runtime constraints:

- local-only data only (no server/account/cloud)
- no online rank or matchmaking stats
- separate key from settings: `instrument-brawl:records`
- keep `instrument-brawl:settings` and records storage fully separate

Initial payload (v1):

- `version: 1`
- `totalMatches: 0`
- `p1Wins: 0`
- `p2Wins: 0`
- `draws: 0`
- `cpuMatches: 0`
- `local2pMatches: 0`
- `lastPlayedAt: null`

Counting rules for one completed match:

- increment `totalMatches` once
- increment winner bucket (`p1Wins` or `p2Wins`) or `draws`
- increment `cpuMatches` or `local2pMatches` by `player2Mode`
- set `lastPlayedAt` to ISO timestamp string
- do not track per-hit/damage/replay/detailed analytics

Double-count prevention (highest priority):

- record exactly once per completed match
- transitions/rematch/return-home/return-character-select must not add duplicates
- use a small guard flag in future runtime implementation

Preferred future save timing:

- determine result in BattleScene as today
- write records exactly once on first ResultScene entry
- reason: centralized single write point with stable final result + mode context

Sanitize/fallback behavior:

- unavailable localStorage -> default empty records, no crash
- parse failure -> default empty records
- missing/invalid/negative/NaN/wrong-type fields -> sanitize to safe defaults
- unknown `version` -> safe fallback for now
- invalid records must not remove settings
- Reset Preferences must not remove records

Out of scope in this phase step:

- achievements/trophies/unlocks
- encyclopedia/story progress
- online rank/account/matchmaking stats
- replay/damage logs/per-fighter deep analytics
- server/cloud save


### Phase 8-10: Reset Records design docs

Design rules:

- Reset Records resets only `instrument-brawl:records`
- Do not modify/delete/read `instrument-brawl:settings`
- Keep Reset Records separate from Reset Preferences
- No Reset All action in this phase

Reset defaults:

- `version: 1`
- `totalMatches: 0`
- `p1Wins: 0`
- `p2Wins: 0`
- `draws: 0`
- `cpuMatches: 0`
- `local2pMatches: 0`
- `lastPlayedAt: null`

Future UI behavior (RecordsScene):

- Add dedicated `Reset Records` row/action
- Two-step confirmation (`Reset Records: Press again to confirm`)
- Escape or moving selection away cancels pending confirmation
- Keep interaction simple (no modal/admin menu)

Expected post-reset behavior:

- RecordsScene shows 0 counters and `Last Played: Never`
- `instrument-brawl:settings` remains unchanged
- Effects/screen shake and last selected fighters/mode remain unchanged
- Gameplay logic/values remain unchanged

Failure/fallback behavior:

- unavailable localStorage -> fail safely without crash
- save/remove failure -> fail safely without crash
- sanitize/default records fallback remains active
- invalid records handling must not remove settings


### Phase 8-12: Retire / Forfeit design docs

Purpose:

- voluntary early match-end escape hatch
- keep compact and non-complex
- no timer/round expansion coupling

Winner/result rules:

- P1 retires -> P2 wins
- P2 Human retires -> P1 wins
- P1 vs CPU: only P1 can retire (CPU does not retire)
- retire does not produce draw
- use existing ResultScene flow with result kind `p1`/`p2`

Records behavior:

- retire counts as normal completed match
- increment `totalMatches` once
- increment winner bucket as above
- increment `cpuMatches` or `local2pMatches` by `player2Mode`
- update `lastPlayedAt`
- once-per-result guard must prevent duplicate counts
- no retire-specific counters in Phase 8

Future UI direction:

- location: Pause / Quick Help overlay
- two-step confirm (`Retire: Press again to confirm`)
- cancel via `P` resume/cancel; selectable-overlay cancel path can use Escape/move-away
- no full pause/admin menu

Control/timing constraints:

- do not steal current battle controls
- do not use battle `R` for retire
- retire available only after Fight/matchStarted
- retire does nothing after `matchOver`
- no breakage of Ready/Fight or pause behavior

Result display direction:

- keep text simple (`P1 Retired - P2 Wins`, `P2 Retired - P1 Wins`)
- keep result bucket as `p1`/`p2` (no new result type now)

Out of scope:

- no retire implementation in this docs task
- no pause implementation changes in this docs task
- no timer/rounds/surrender stats/retire achievements/penalties
- no online/disconnect behavior
- no CPU retire AI
- no server/cloud save


### Phase 8-13: Timer design docs

Purpose and role:

- optional future pacing tool
- prevents very long/stalled matches
- keeps quick replayable tone
- no rounds coupling in Phase 8

Optional behavior direction:

- not implemented in Phase 8
- not default-enabled until later playtesting
- current no-timer behavior stays baseline

Duration direction (future candidates):

- default candidate: 60 seconds
- alternatives: 45 seconds, 90 seconds
- no timer settings/custom durations in Phase 8

Timeout result rules:

- higher HP wins on timeout
- equal HP -> draw
- existing KO/draw combat-end rules remain valid
- use existing ResultScene flow and `p1`/`p2`/`draw` result kinds
- no timeout-specific result bucket now

Timeout records behavior:

- treated as normal completed match
- increment `totalMatches` once
- increment winner/draw bucket accordingly
- increment `cpuMatches`/`local2pMatches` by mode
- update `lastPlayedAt`
- once-per-result rule still prevents double count
- no timer-specific records fields in Phase 8

Future UI/pause direction:

- compact timer label in BattleScene top-center area
- simple text (`Time: 60` style)
- pause/help freezes timer
- timer starts after Ready/Fight control start
- timer stops after `matchOver`
- no audio countdown or heavy animation

Interaction with Retire:

- retire and timer stay separate
- retire-first -> retire result wins
- timeout-first -> timeout result wins
- no merged retire/timer logic in Phase 8 docs task

Out of scope:

- no timer implementation in this docs task
- no timer UI/settings implementation
- no rounds/sudden death/overtime/time bonus
- no timer-specific records fields
- no online/server timer sync
- no competitive/tournament rules expansion


### Phase 8-14: Equipment / Amp design docs

Purpose and role:

- future lightweight match-customization (not RPG/meta-progression)
- keep silly/readable local-match variety
- remain optional and easy to disable
- not implemented in Phase 8

Optional behavior baseline:

- no-equipment baseline remains current standard
- no equipment UI/storage/records integration in Phase 8

Future structure direction:

- 0 or 1 support equipment per player
- selected near/after Character Select in future
- match-local scope only
- no account/server/progression dependency

Amp candidate direction:

- first support-equipment concept
- flavor: boost/project instrument sound
- may later support sonic/ranged-feeling behavior
- Phase 8 stays design-only (no attacks/projectiles/assets)
- no combat-value or hitbox/cooldown changes now

Candidate options (not final):

- visual-only sound-wave effect
- attack presentation variation
- future reach modifier experiment
- future sonic/ranged attack-method experiment
- possible future tradeoff if range is added

Balance guardrails:

- preserve fighter identity readability
- no huge damage spikes
- no critical/guard/just-guard/special systems in Phase 8
- no rounds/timer dependency for equipment

Future UI direction:

- candidate: Character Select follow-up or tiny Equipment Select step
- defaults: `Equipment: None`
- candidate option: `Equipment: Amp`
- simple left/right selection
- same-equipment mirror matches allowed unless later playtesting changes this
- do not expand Home flow in this docs task

Records direction:

- no equipment fields/analytics in records during Phase 8
- keep normal records counters only

Relation to attack categories:

- equipment may later reference `attackMethod` / `impactClass`
- detailed category definition deferred to Phase 8-15

Out of scope:

- no Equipment/Amp implementation
- no equipment selection UI/storage
- no equipment records fields
- no ranged/sonic attacks
- no damage/hitbox/cooldown/startup changes
- no critical/guard/just-guard/specials
- no rounds/timer dependency
- no unlock/rarity/crafting/loot/currency/shop/progression
- no assets/sprites/3D/BGM/SE
- no online/server/account storage

### Phase 8 guardrails for scope/docs tasks

Do not change gameplay values/logic during Phase 8 scope/docs tasks:

- HP
- damage
- knockback
- attack cooldown
- attack duration
- hitbox
- CPU behavior
- one-hit-per-attack

**Next recommended task:** Phase 9-12: Battle HUD equipment labels.

## Features to avoid for now

- Online multiplayer.
- Complex combos.
- Competitive ranking.
- Large move lists.
- Campaign or story mode.
- Unlock systems.
- Deep customization.
- CPU behavior beyond the minimal early Phase 4 P2 CPU.
- BGM/SE audio files.
- Story or encyclopedia features.
- Progression systems.
- Specials or items.
- Timer or rounds.
- Retire button.
- More fighters before Phase 4 solo play preparation and presentation/polish improve the completed core band roster.


### Phase 8-15: attackMethod / impactClass docs

Purpose:

- Define future non-runtime category language for attack delivery (`attackMethod`) and hit-feel (`impactClass`).
- Improve readability and planning vocabulary for effects/equipment/balance discussions.
- Keep current gameplay unchanged.

Category direction (docs only):

- `attackMethod` candidates: `direct`, `sonic`, `ranged`, `hybrid`
- `impactClass` candidates: `physical`, `sound`, `burst`, `technical`
- Current runtime is conceptually `direct` baseline.
- These are not TypeScript fields in Phase 8.

Difference examples (non-binding):

- `direct + physical`
- `sonic + sound`
- `ranged + burst`
- `hybrid + technical`

Guardrails:

- no automatic buffs from categories
- no combat tuning in this docs task
- if later implemented, ranged/sonic likely needs tradeoffs and playtesting
- preserve fighter identity readability

Out of scope:

- no runtime implementation/schema changes
- no projectiles/sonic attacks
- no damage/knockback/cooldown/duration/hitbox changes
- no records/settings schema changes
- no assets/audio/online/server work

**Next recommended task:** Phase 9-12: Battle HUD equipment labels.


### Phase 8-17: Phase 8 checkpoint docs

Phase 8 checkpoint is docs-complete and ready.

Implemented runtime summary:

- Options preferences (Effects / Screen Shake), Reset Preferences two-step settings-only reset.
- Records runtime (`instrument-brawl:records`) with total/win/draw/mode counters and `lastPlayedAt`.
- ResultScene once-per-completed-match recording.
- RecordsScene display and Home -> Records -> Home flow.
- Reset Records two-step records-only reset.
- Settings and records remain separate keys.

Design-only future summary (not implemented):

- Retire / Forfeit
- Timer
- Equipment / Amp
- `attackMethod` / `impactClass`

Checkpoint guardrails unchanged:

- HP, damage, knockback, cooldown, attack duration, hitboxes
- CPU behavior, one-hit-per-attack
- Ready/Fight timing, Pause/Quick Help behavior
- ResultScene `R` / `C` / Home transitions

Manual verification reminder before next phase:

- Home -> Options -> Home
- Home -> Records -> Home
- Reset Preferences does not touch records
- Reset Records does not touch settings
- Match records count once and ResultScene exits do not double-count
- Existing battle flow still works

**Next recommended task:** Phase 9-12: Battle HUD equipment labels.


## Phase 9: Equipment Shell & Attack Identity Foundation

Phase 9 is not a combat-buff phase. It prepares a lightweight equipment shell and attack-identity vocabulary while preserving current gameplay values.

Core direction:

- equipment selection shell
- scene-to-scene equipment ID handoff
- last-selected equipment persistence planning
- compact equipment labels in Battle/Result UI
- attack identity language foundation (`attackMethod` / `impactClass`)

Initial equipment candidates:

- `none` (No Accessory)
- `amp` (Amp)
- `pick` (Pick)
- `case` (Case)

### Phase 9 task plan (9-1 .. 9-17)

- 9-1 Phase 9 scope and guardrails docs (**docs-only**) — this task
- 9-2 Phase 8 docs cleanup (**docs-only**) — complete (this task)
- 9-3 Equipment concept docs (**docs-only**) — complete (this task)
- 9-4 Equipment data model docs (**docs-only**) — complete (this task)
- 9-5 Equipment registry implementation (**runtime**) — complete (this task)
- 9-6 EquipmentSelectScene design docs (**docs-only**) — complete (this task)
- 9-7 EquipmentSelectScene shell (**runtime**) — complete (this task)
- 9-8 P1/P2 equipment selection (**runtime**) — complete (this task)
- 9-9 Equipment data handoff (**runtime**) — complete (this task)
- 9-10 Rematch / return preservation (**runtime**) — complete (this task)
- 9-11 localStorage equipment persistence (**runtime**) — complete (this task)
- 9-12 Battle HUD equipment labels (**runtime**)
- 9-13 Result equipment display (**runtime**)
- 9-14 Amp visual-only accent trial (**runtime visual-only**)
- 9-15 Future equipment effect docs (**docs-only**)
- 9-16 Playtest checklist update (**docs-only**)
- 9-17 Phase 9 checkpoint docs (**docs-only**)

Phase 9 explicit non-goals:

- no real damage/range/defense increase
- no critical damage/rate
- no guard/just guard
- no special moves/combos
- no timer gameplay/rounds/retire button
- no new fighters/story/encyclopedia runtime
- no online/server/cloud save
- no BGM/SE assets/playback or image/sprite/3D assets
- no equipment-specific records schema/analytics

Gameplay/system guardrails remain unchanged:

- HP, damage, knockback
- attack cooldown, attack duration
- hitbox size/hit detection
- CPU behavior
- one-hit-per-attack rule
- Ready/Fight timing
- Pause/Quick Help behavior
- ResultScene `R` / `C` / Home transitions
- records schema

**Next recommended task:** Phase 9-12: Battle HUD equipment labels.
