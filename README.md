# instrument-brawl

楽器同士が殴り合う1vs1物理格闘ゲームです。

ソーセージレジェンズに近い、ネタ寄りの物理バトルを目指します。
現在は Electric Guitar、Bass、Drum Sticks、Keyboard から選べる、シンプルなローカル1v1プロトタイプです。

## Current status

- Browser-playable Phaser + Vite + TypeScript game.
- Local 1v1 battle with Home -> Mode Select -> Character Select -> Battle -> Result scene flow.

Current scene flow: `Home -> Mode Select -> Character Select -> Battle -> Result` (+ `Home -> Records -> Home` + `Home -> Options -> Home`).

Phase 7 checkpoint flow: `Home -> Mode Select -> Character Select -> Battle -> Result` (+ `Home -> Options -> Home`).

Mode Select behavior:

- Two vertically stacked large choices are shown: VS HUMAN (Local 2P) and VS CPU (P1 vs CPU).
- Local 2P maps to `player2Mode: "human"`.
- P1 vs CPU maps to `player2Mode: "cpu"`.
- Home Start now goes Home -> Mode Select -> Character Select.
- Home Records now opens RecordsScene for local records display.
- CharacterSelectScene uses the fighter registry and currently offers Electric Guitar, Bass, Drum Sticks, and Keyboard.
- P2 defaults to Human for local 2-player, with an optional simple CPU mode available from Character Select.
- Movement, attacks, HP, damage, velocity-based knockback, hit flash, win/draw detection, Ready/Fight start prompt, rematch, and return-to-character-select flow are implemented.
- Attack hit detection stays active during the visible attack duration, but one attack can hit only once.
- Phase 2.5 and Phase 3 are complete; the core band 4 fighters are implemented.

## Controls

### Home

- Left / Right (or Up / Down): choose Start / Records / Options
- Enter / Space: confirm

### Mode select

- Up / Down (or Left / Right): choose mode (VS HUMAN / VS CPU)
- Enter / Space: confirm mode and open Character Select
- Escape: return Home

### Character select

- P1 A / D: choose fighter
- P2 Left / Right: choose fighter
- P2 Down: switch P2 Human / CPU
- Enter / Space: start battle
- Escape: return Home

### Options

- Up / Down: choose setting
- Left / Right or Enter / Space: toggle selected setting
- Escape: return Home

### Battle

- P1 A / D: move
- P1 W / Space: attack
- P2 Left / Right: move when P2 mode is Human
- P2 Up / Enter: attack when P2 mode is Human
- P: pause / quick help

### Result

- R: rematch with the same fighters
- C: return to character select with the same fighters selected
- Enter / Space: return Home

## Current fighters

| Fighter | Status | HP | Move speed | Damage | Knockback speed | Attack style |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | Implemented | 100 | 260 | 10 | 520 | Faster standard fighter with a sharper horizontal attack hitbox |
| Bass | Implemented | 105 | 230 | 10 | 580 | Slower heavier fighter with a taller/heavier attack hitbox |
| Drum Sticks | Implemented | 80 | 310 | 8 | 420 | Lightweight fast fighter with short reach |
| Keyboard | Implemented | 95 | 215 | 9 | 500 | Wide, awkward area-control fighter with a broad body and long reach |

## Phase 3 completion

Phase 3 completed the core band 4 fighters:

1. Electric Guitar — already implemented.
2. Bass — already implemented.
3. Drum Sticks — implemented in Phase 3-2.
4. Keyboard — implemented in Phase 3-6 as a wide, awkward area-control fighter.

Phase 3 kept the game simple: local 1v1 only, simple rectangle prototype visuals, one attack per fighter, one attack hitting only once, and same-character selection allowed. Next work should move to Phase 4 unless a task explicitly says otherwise.

Instrument Brawl should not over-normalize fighters. The goal is funny, readable, replayable imbalance with clear strengths and weaknesses, not tournament-level fairness.

Later candidate ideas, not Phase 3 tasks: Microphone, Piano, Bongo, and Tambourine.

## Phase 4 checkpoint

Phase 4 currently covers solo play preparation, presentation/polish, and audio-ready planning without audio assets.

Implemented Phase 4 checkpoint items:

- Four selectable fighters remain available: Electric Guitar, Bass, Drum Sticks, and Keyboard.
- Local 2P remains the default, with optional P2 CPU mode from Character Select.
- P2 Human/CPU mode is preserved through BattleScene, ResultScene, R rematch, and C return-to-character-select.
- Minimal CPU behavior is implemented and received a sanity pass so short-reach CPU fighters keep approaching.
- Audio policy is documented without BGM/SE audio files or playback; see `docs/audio-policy.md`.
- Light menu, arena, and hit/result feedback polish are implemented with rectangle/text visuals only.

The current game still intentionally avoids new fighters, specials, items, progression, story, encyclopedia, timer, rounds, retire button, BGM/SE audio files, settings screen, and online play.

Phase 5 checkpoint is now documented: foundation cleanup and roadmap alignment are complete, ResultScene subtitle wording is polished to `Match finished`, and a compact in-battle Pause / Quick Help overlay is implemented with `P` (not a full tutorial).

## Phase 5 and later direction

Phase 5 stayed focused on foundation cleanup, compact Pause / Quick Help, and roadmap alignment without gameplay expansion.

Next recommended direction:

- Phase 6 effects trial checkpoint is complete (small visual-only experiments).
- Phase 7: game shell & local save foundation direction (Home / Mode / Options planning, localStorage preference planning, and lightweight records foundation planning).
- Phase 8: match rule expansion consideration such as Retire / Timer / rounds, without rushing rounds.
- Phase 9: encyclopedia, records, and light worldbuilding.
- Phase 10+: specials, items, new fighters, and larger content expansion.


## Phase 7 checkpoint summary

Phase 7 checkpoint is complete.

Completed in Phase 7:

- Game shell complete: `Home -> Mode Select -> Character Select -> Battle -> Result` and `Home -> Options -> Home`.
- Mode Select complete: VS HUMAN / Local 2P maps to `player2Mode: "human"`; VS CPU / P1 vs CPU maps to `player2Mode: "cpu"`.
- Character Select keeps the existing P2 Human/CPU toggle as fallback/manual override.
- `player2Mode` is preserved through Battle, Result, `R` rematch, and `C` return-to-character-select.
- localStorage settings complete using `instrument-brawl:settings`.
- Saved settings include `lastSelected.player1FighterId`, `lastSelected.player2FighterId`, `lastSelected.player2Mode`, `preferences.effectsEnabled`, and `preferences.screenShakeEnabled`.
- Stored selections are restored into Mode Select / Character Select initial UI, and invalid stored values safely fall back to defaults.
- Options complete for this phase scope: Effects ON/OFF and Screen Shake ON/OFF are toggleable and saved.
- Effects OFF hides nonessential extras only; Screen Shake OFF disables tiny shake only.
- Gameplay values and logic remain unchanged.
- Records foundation docs complete.
- Records runtime implementation is complete: storage utility, once-per-match result saving, RecordsScene shell, and Reset Records are implemented.
- Reset Preferences is implemented in OptionsScene.

## Phase 8 scope: Records / Reset / Match Rule & Equipment Planning

Phase 8 is **not** a major combat expansion phase.

### Phase 8 implementation targets

- Reset Preferences
- Records localStorage utility
- Save match result once
- RecordsScene shell
- Home Records entry — complete
- Reset Records — complete
- Playtest checklist updates

### Phase 8 docs/design-only targets

- Retire / Forfeit — complete
- Timer — complete
- Equipment / Amp
- `attackMethod` / `impactClass`
- Critical rate / guard / just guard (future design topics only)

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


### Phase 8-3 Reset Preferences design (docs only)

Reset Preferences is settings-only and is separate from Reset Records.

- Target key: `instrument-brawl:settings` only
- Must not read/write/delete `instrument-brawl:records`
- Must not combine with Reset Records into a single reset-all action in this phase

Reset target defaults:

- `lastSelected.player1FighterId`: `electric-guitar` (Electric Guitar)
- `lastSelected.player2FighterId`: `bass` (Bass)
- `lastSelected.player2Mode`: `human` (Human)
- `preferences.effectsEnabled`: `true` (ON)
- `preferences.screenShakeEnabled`: `true` (ON)

Future UI behavior (simple, no modal system):

- Reset Preferences lives in `OptionsScene`
- It is a separate selectable row/action from Effects and Screen Shake
- First confirm arms reset and shows a small prompt like `Press again to confirm`
- Second confirm executes reset
- Escape or moving selection away cancels the pending confirmation

Expected behavior after reset:

- Stored settings return to defaults
- Reopening Mode Select highlights default Human mode
- Reopening Character Select uses default fighters unless scene data overrides
- Reopening Options shows Effects ON and Screen Shake ON
- Gameplay values/logic remain unchanged

Failure/fallback behavior:

- If localStorage is unavailable, fail safely and keep runtime usable
- If remove/save fails, gameplay must not crash
- Existing sanitize/default fallback behavior remains the safety net


### Phase 8-5 Records runtime design (docs only)

Records runtime is local-only.

- No server save
- No account sync
- No online ranking
- No matchmaking stats
- No cloud persistence

Storage separation:

- Settings key remains `instrument-brawl:settings`
- Records key is `instrument-brawl:records`
- Records and settings must stay separate

Initial records payload (versioned JSON):

```json
{
  "version": 1,
  "totalMatches": 0,
  "p1Wins": 0,
  "p2Wins": 0,
  "draws": 0,
  "cpuMatches": 0,
  "local2pMatches": 0,
  "lastPlayedAt": null
}
```

Match counting rules (when a completed match is recorded):

- Increment `totalMatches` once
- Increment `p1Wins` for P1 win
- Increment `p2Wins` for P2 win
- Increment `draws` for draw
- Increment `cpuMatches` when `player2Mode === "cpu"`
- Increment `local2pMatches` when `player2Mode === "human"`
- Update `lastPlayedAt` with an ISO timestamp string
- Do not track per-hit data, damage history, replays, detailed logs, or analytics

Most important rule: prevent double counting.

- One completed match must be saved once only
- Result transitions, `matchOver` timing, `R` rematch, `C` return-to-character-select, and Enter/Space return Home must not duplicate counts
- Future implementation should use a small once-per-match guard flag

Preferred future ownership/timing:

- BattleScene continues deciding winner/draw
- Persist records exactly once **when ResultScene is first entered**
- Reason: one centralized entry point for P1/P2/draw + `player2Mode` context, lower risk of duplicate writes from battle update timing

Sanitize/fallback rules:

- If localStorage is unavailable, use default empty records and do not crash
- If parse fails, fallback to default empty records
- Missing/invalid/negative/NaN/wrong-type fields sanitize to safe defaults
- Unknown `version` falls back safely for now
- Invalid records must not delete settings
- Reset Preferences must not delete records

Records runtime out of scope:

- achievements, trophies, unlocks
- encyclopedia/story progress
- online rank/account stats/matchmaking
- replay data, damage logs, per-fighter detailed analytics
- server/cloud save


### Phase 8-10 Reset Records design (docs only)

Reset Records is records-only and separate from Reset Preferences.

- Target key: `instrument-brawl:records` only
- Must not read/write/delete `instrument-brawl:settings`
- Must not change Reset Preferences behavior
- Must not introduce a combined Reset All action in this phase

Reset target defaults:

- `version: 1`
- `totalMatches: 0`
- `p1Wins: 0`
- `p2Wins: 0`
- `draws: 0`
- `cpuMatches: 0`
- `local2pMatches: 0`
- `lastPlayedAt: null`

Future UI behavior (simple):

- Location: `RecordsScene`
- Add a separate `Reset Records` row/action
- First confirm arms reset and shows `Reset Records: Press again to confirm`
- Second confirm executes reset
- Escape or moving selection away cancels armed reset
- Keep this as compact inline behavior (no modal/admin menu)

Expected behavior after reset:

- Records storage returns to default empty values
- RecordsScene immediately shows zeros and `Last Played: Never`
- Settings remain unchanged (`instrument-brawl:settings`)
- Effects/Screen Shake and last selected fighters/mode remain unchanged
- Gameplay values/logic remain unchanged

Failure/fallback behavior:

- If localStorage is unavailable, fail safely and keep runtime usable
- If save/remove fails, gameplay must not crash
- Existing sanitize/default records fallback remains safety net
- Invalid records must not delete settings


### Phase 8-12 Retire / Forfeit design (docs only)

Purpose:

- Retire/Forfeit is a voluntary early match-end escape hatch for stuck, boring, or clearly lost matches
- Keep it compact and simple
- Do not turn it into a larger match-rule system
- Do not introduce rounds/timer behavior

Winner/result rules (future):

- If P1 retires, P2 wins
- If P2 Human retires, P1 wins
- In P1 vs CPU mode, only P1 (human) can retire for now
- CPU does not retire voluntarily
- Retire never creates draw
- Use existing ResultScene flow
- Underlying result kind remains `p1` or `p2`

Records behavior (future):

- Retire counts as a normal completed match
- Increment `totalMatches` once
- P1 retire -> increment `p2Wins`
- P2 Human retire -> increment `p1Wins`
- Increment `cpuMatches` or `local2pMatches` by current mode
- Update `lastPlayedAt`
- Existing once-per-result guard must still prevent double count
- Do not add `retireCount` / `p1Retires` / `p2Retires` in Phase 8

Future UI/UX direction:

- Preferred location: BattleScene Pause / Quick Help overlay
- Retire needs two-step confirmation
- First confirm arms: `Retire: Press again to confirm`
- Second confirm executes retire
- Cancel paths: `P` resume/cancel, and later selectable-overlay cancel via Escape/move-away if implemented
- Keep UI compact (no full pause/admin menu)

Control/timing constraints:

- Keep existing battle controls unchanged
- Do not use `R` in battle for retire (reserved for Result rematch)
- Prefer pause/help-attached action instead of raw battle input
- Retire only after Fight / matchStarted
- Retire does nothing after `matchOver`
- Must not break Ready/Fight timing or pause behavior
- Use same end-match path family as KO/draw

Result display direction:

- Keep simple display text, e.g. `P1 Retired - P2 Wins` / `P2 Retired - P1 Wins`
- Do not add new result bucket in this phase
- Do not change records schema for retire text

Out of scope:

- No Retire implementation in this docs task
- No Pause/Quick Help implementation change in this docs task
- No timer/rounds/surrender stats/retire achievements/penalties
- No online/disconnect behavior
- No CPU retire AI
- No server/cloud save


### Phase 8-13 Timer design (docs only)

Purpose:

- Timer is a future optional pacing tool
- It helps prevent matches from dragging forever
- It supports quick, silly, replayable matches
- It should not push the game toward strict competitive rules
- It does not introduce rounds in Phase 8

Future optional behavior direction:

- Timer is not implemented in Phase 8
- Timer is not enabled by default until later playtesting
- Current no-timer behavior remains baseline
- Treat timer as later match-rule expansion

Future duration direction:

- Primary candidate: 60 seconds
- Later test candidates: 45 seconds / 90 seconds
- No timer settings UI in Phase 8
- No custom timer lengths in Phase 8

Timeout winner rules (future):

- Higher remaining HP wins
- Equal HP -> draw
- Existing KO/draw rules still apply if both reach 0 by combat before/at match end
- Timeout should use existing ResultScene flow
- Result kind remains `p1` / `p2` / `draw`
- No new timeout-specific result bucket in Phase 8

Records behavior on timeout (future):

- Count as normal completed match
- Increment `totalMatches` once
- Timeout P1 win -> `p1Wins` +1
- Timeout P2 win -> `p2Wins` +1
- Timeout draw -> `draws` +1
- Increment `cpuMatches` or `local2pMatches` by `player2Mode`
- Update `lastPlayedAt`
- Existing once-per-result rule must still prevent double counts
- No timer-specific records fields (`timeoutWins`, `timeoutDraws`, `timeRemaining`) in Phase 8

Future UI direction:

- Compact timer display in BattleScene
- Suggested location: top center near title/HP area
- Simple text style (e.g., `Time: 60`, `Time: 12`)
- Readable but not dominant
- No animation-heavy timer effects in Phase 8 design
- No audio countdown

Pause interaction direction:

- Timer pauses while Pause / Quick Help is open
- Timer does not count during pause
- Timer starts only after Ready/Fight completes and control begins
- Timer stops after `matchOver`
- Timer must not break Ready/Fight timing

Interaction with Retire / Forfeit:

- Retire remains separate from timer
- If retire happens before timeout, retire result wins
- If timeout happens first, timeout result wins
- Do not merge retire/timer logic in Phase 8
- Do not implement either in this docs task

Out of scope:

- No timer implementation in this docs task
- No timer UI implementation
- No timer settings/custom durations
- No rounds/sudden death/overtime/time bonus
- No timer-specific records fields
- No audio countdown
- No online/server timer sync
- No tournament/competitive rule expansion


### Phase 8-14 Equipment / Amp design (docs only)

Equipment purpose:

- Future lightweight match-customization layer
- Add instrument-flavored variety while keeping matches silly/readable/local-fun
- Avoid deep RPG systems (no progression/unlocks/rarity/crafting/loot/meta-builds)
- Not implemented in Phase 8

Optional behavior direction:

- No-equipment remains baseline
- Equipment remains optional and unavailable until later implementation
- No equipment selection UI/storage/records fields in Phase 8

Preferred future structure:

- Each player may eventually choose 0 or 1 support equipment
- Selection should happen near Character Select in a later phase
- Match-local scope only
- No progression persistence and no server/account dependency
- Easy to disable for simple matches

Amp concept direction (future candidate):

- Amp is first support-equipment candidate
- Flavor: boost/project instrument sound
- Could later support sonic/ranged-feeling presentation/behavior
- Phase 8 is design-only: no Amp attacks/ranged/sonic projectiles
- No hitbox/damage/knockback/cooldown/attack-duration changes
- No Amp assets/sprites/sound/3D

Candidate Amp behavior options (not final):

- visual-only sound-wave effect
- slightly different attack presentation
- future reach modifier experiment
- future sonic/ranged attack-method experiment
- future tradeoff idea if range is added (e.g., slower startup/lower damage)

Important: no final stats/tuning decisions in this task.

Equipment balance guardrails:

- Must not erase fighter identity (Electric Guitar/Bass/Drum Sticks/Keyboard)
- Must avoid huge damage spikes
- No critical-rate/random-damage behavior in Phase 8
- No guard/just-guard/special-move additions in Phase 8
- No rounds/timer dependency for equipment
- Keep readable via compact UI label

Future UI direction (not implemented now):

- Candidate location: Character Select follow-up or a small Equipment Select step before Battle
- Candidate options: `Equipment: None`, `Equipment: Amp`
- Simple left/right selection
- Same equipment allowed for both players by default (subject to later playtesting)
- Default should be `None`
- Keep Character Select usable without equipment
- Do not expand Home flow in this task

Records direction:

- No equipment fields in records during Phase 8
- No equipment usage/win-loss analytics yet
- Continue normal records counters only

Relation to `attackMethod` / `impactClass`:

- Equipment/Amp may later reference those categories
- Do not finalize/implement those fields here
- Detailed category docs belong to Phase 8-15

Out of scope:

- No Equipment implementation
- No Amp implementation
- No equipment UI/storage/records fields
- No ranged attacks/sonic projectiles
- No damage/hitbox/cooldown/startup changes
- No critical rate/guard/just guard/special moves
- No rounds/timer dependency
- No unlock/rarity/crafting/loot/currency/shop/progression
- No assets/sprites/3D/BGM/SE
- No online/server/account storage

### Phase 8 guardrails for scope/docs tasks

During Phase 8 scope/docs tasks, do not change:

- HP
- damage
- knockback
- attack cooldown
- attack duration
- hitbox
- CPU behavior
- one-hit-per-attack

- Phase 8-6 records storage utility is implemented.
- Phase 8-7 match result saving is implemented with once-per-result recording to `instrument-brawl:records`.
- RecordsScene shell is implemented and displays local records from `instrument-brawl:records`.
- Home Records entry is implemented (Home -> Records -> Home).
- Reset Records — complete is implemented in RecordsScene with two-step confirmation and resets only `instrument-brawl:records`.

**Next recommended task:** Phase 9-13: Result equipment display.

### Phase 8-15 attackMethod / impactClass design (docs only)

Purpose:

- `attackMethod` is a future label for *how* an attack is delivered.
- `impactClass` is a future label for the *feel/type* of impact.
- These are planning labels for readability, future effects/equipment planning, and later balance talks.
- These labels do not change gameplay by themselves and are not records/settings fields in Phase 8.

Future `attackMethod` candidate categories (design only):

- `direct`: close/contact baseline (current conceptual baseline)
- `sonic`: sound-wave/vibration flavored delivery
- `ranged`: distance/projectile-like delivery in later phases
- `hybrid`: mixed direct + sonic/ranged behavior

Future `impactClass` candidate categories (design only):

- `physical`: solid/contact-heavy hit feel
- `sound`: vibration/sound-pressure flavored hit feel
- `burst`: short explosive/flashy hit feel
- `technical`: precise/controlled utility-like hit feel

Difference and examples (non-binding design examples):

- `attackMethod=direct`, `impactClass=physical`
- `attackMethod=sonic`, `impactClass=sound`
- `attackMethod=ranged`, `impactClass=burst`
- `attackMethod=hybrid`, `impactClass=technical`

Current fighters and current runtime:

- Electric Guitar / Bass / Drum Sticks / Keyboard remain unchanged baseline.
- Do not assign final category values yet.
- No runtime attack behavior changes in this phase task.

Relation to Equipment / Amp:

- Amp may later experiment with `sonic`, `ranged`, or `hybrid` delivery labels.
- Amp may later use `sound` impact flavor.
- This is not a commitment to implement ranged Amp.
- Any sonic/ranged runtime behavior requires a later implementation phase and playtesting.

Future use cases:

- visual-effect direction
- docs/UI attack descriptions
- equipment design discussions
- fighter differentiation and balance discussion vocabulary

Not used yet for:

- records/settings schema
- unlocks/achievements/progression
- online/server/account systems
- direct damage formula changes

Balance guardrails:

- Categories do not create automatic buffs.
- `ranged` must not be strictly better than `direct`.
- If implemented later, sonic/ranged likely needs tradeoffs (startup/cooldown/damage/duration/telegraphing).
- Do not decide final tradeoffs or tune combat values in this docs task.

Out of scope:

- No TypeScript implementation or FighterDefinition schema changes.
- No `attackMethod` / `impactClass` runtime fields yet.
- No attack behavior/projectile/sonic implementation.
- No HP/damage/knockback/cooldown/duration/hitbox changes.
- No critical/guard/just guard/special/timer/rounds implementation.
- No records/settings schema changes.
- No assets/sprites/3D/BGM/SE or online/server/account storage.

**Next recommended task:** Phase 9-13: Result equipment display.


## Phase 8 checkpoint

Phase 8 is checkpoint-ready and docs-complete.

### Implemented runtime features

- OptionsScene preferences are implemented: Effects ON/OFF and Screen Shake ON/OFF.
- Reset Preferences is implemented with two-step confirmation, resets settings only (`instrument-brawl:settings`), and restores defaults (`electric-guitar`, `bass`, `human`, Effects ON, Screen Shake ON).
- Records runtime is implemented at `instrument-brawl:records` with: `totalMatches`, `p1Wins`, `p2Wins`, `draws`, `cpuMatches`, `local2pMatches`, `lastPlayedAt`.
- ResultScene records completed matches once per match result entry.
- RecordsScene is implemented, displays local records, and Home -> Records -> Home works.
- Reset Records is implemented with two-step confirmation and resets records only (`instrument-brawl:records`).
- Settings and records remain separate localStorage keys.

### Design-only future items (not implemented)

- Retire / Forfeit: planned voluntary early match end (`P1 retire -> P2 win`, `P2 Human retire -> P1 win`).
- Timer: planned optional pacing tool (60s candidate; timeout uses higher HP winner, equal HP draw).
- Equipment / Amp: planned optional lightweight match customization; Amp is first candidate; no ranged/sonic runtime in Phase 8.
- `attackMethod` / `impactClass`: planned future labels only; no schema/runtime changes in Phase 8.

### Phase 8 guardrails (unchanged)

Phase 8 did not intentionally change: HP, damage, knockback, attack cooldown, attack duration, hitboxes, CPU behavior, one-hit-per-attack, Ready/Fight timing, Pause/Quick Help behavior, and ResultScene `R` / `C` / Home transitions.

### Manual verification reminder before Phase 9

- Home -> Options -> Home
- Home -> Records -> Home
- Reset Preferences does not touch records
- Reset Records does not touch settings
- Match records count once
- ResultScene `R` / `C` / Home return does not double-count
- Existing battle flow still works

**Next recommended task:** Phase 9-13: Result equipment display.



## Phase 9 scope: Equipment Shell & Attack Identity Foundation

Phase 9 begins with **Equipment Shell & Attack Identity Foundation**.

Phase 9-1 is docs-only and defines scope/guardrails before runtime work.

Phase 9 purpose (not a combat-buff phase):

- choose equipment
- pass equipment IDs between scenes
- save/restore last selected equipment
- display equipment labels
- prepare future attack identity language

Planned initial equipment candidates (future tasks):

- `none`: No Accessory
- `amp`: Amp
- `pick`: Pick
- `case`: Case

Important for this PR:

- Equipment/Amp runtime behavior is not implemented here.
- No EquipmentSelectScene, registry runtime wiring, or equipment persistence runtime implementation is added in this PR.
- `attackMethod` / `impactClass` remain planning language unless a later explicit runtime task implements them.

### Phase 9-3 equipment concept (docs only)

This task defines equipment concept language only. No runtime equipment behavior is implemented in this PR.

Candidate concepts:

- `none` (No Accessory): baseline/default; fully playable/readable; comparison point.
- `amp` (Amp): sound-projection/stage-presence flavor; may later relate to sonic/sound/hybrid identity language; not a ranged/projectile/damage/reach buff here.
- `pick` (Pick): sharper/precise playing flavor; may later support technical wording; not critical-rate/critical-damage/faster-attack/damage-up here.
- `case` (Case): sturdy/carrying-stage-gear flavor; may later support protective wording; not defense-up/damage-reduction/shield/guard/just-guard here.

Concept guardrails for this step:

- equipment remains 0-or-1 support equipment per player
- lightweight/optional and match-local in concept
- fighter identity must remain readable
- no RPG/meta systems (unlocks/rarity/crafting/loot/currency/shop/progression/account/server)
- same equipment for both players stays allowed unless a later task changes it
- no equipment-specific records schema or usage/win-rate analytics
- no gameplay tuning and no runtime/schema implementation in this task

### Phase 9-4 equipment data model (docs only)

This step defines a planned TypeScript-style equipment metadata model in docs only. No runtime model is implemented in this PR.

Planned union:

```ts
type EquipmentId = 'none' | 'amp' | 'pick' | 'case';
```

Planned definition shape:

```ts
type EquipmentDefinition = {
  id: EquipmentId;
  displayName: string;
  shortLabel: string;
  description: string;
  conceptRole: string;
};
```

Planned candidate metadata:

- `none` -> displayName `No Accessory`, shortLabel `None`, conceptRole `default / baseline / no support equipment` (safe default/fallback)
- `amp` -> displayName `Amp`, shortLabel `Amp`, conceptRole `sound projection / stage presence flavor` (no ranged/projectile/damage/reach implication)
- `pick` -> displayName `Pick`, shortLabel `Pick`, conceptRole `sharper / precise playing flavor` (no critical/speed/damage implication)
- `case` -> displayName `Case`, shortLabel `Case`, conceptRole `sturdy / protective stage gear flavor` (no defense/guard/shield implication)

Data-model guardrails:

- metadata only at this stage (identity/display)
- no combat/stat/system fields and no progression/economy/account fields
- invalid or missing equipment IDs should later resolve to `none`
- same equipment for both players remains allowed
- no records/settings schema impact in this docs task

Phase 9-5 equipment registry is implemented as metadata-only runtime foundation in `src/main.ts` (definitions + safe fallback helper); no gameplay effect, no scene wiring, and no persistence/UI integration in this task.

Future runtime direction (not implemented here): later scene handoff (`player1EquipmentId`/`player2EquipmentId`), later persistence, later HUD/Result shortLabel display, and possible later Amp visual-only accent usage.

### Phase 9-6 EquipmentSelectScene design (docs only)

This step defines the future EquipmentSelectScene design only. No runtime scene or flow change is implemented in this PR.

Planned future role:

- insert Equipment Select between Character Select and Battle
- target flow (future): Home -> Mode Select -> Character Select -> Equipment Select -> Battle -> Result
- choose 0 or 1 support equipment per player (`none` / `amp` / `pick` / `case`)

Planned scene goals:

- show selected P1/P2 fighters
- show P1/P2 equipment rows
- default both players to `none`
- allow same equipment on both players
- keep equipment optional/lightweight and fighter-readable

Planned controls:

- Left/Right: cycle current row equipment
- Up/Down: switch P1/P2 row focus
- Enter/Space: confirm and continue
- Esc: return to Character Select
- optional future: `R` resets both rows to `none`

Planned visual direction:

- title: `Equipment Select`
- P1 row + P2 row
- `displayName`, `shortLabel`, and short description
- compact hint: equipment is flavor-only for now
- no sprites/assets/audio required

Planned data direction (future):

- receive fighter context (`player1FighterId`, `player2FighterId`, `player2Mode`)
- later pass equipment IDs (`player1EquipmentId`, `player2EquipmentId`) with fighter context
- invalid/missing equipment IDs should resolve to `none` via registry helper

Boundaries for this phase-step:

- no scene implementation yet
- no gameplay buffs/systems (damage/range/defense/critical/speed/guard/special/projectile)
- no inventory/unlocks/rarity/currency/progression/account/server
- no equipment records analytics

Phase 9-7 EquipmentSelectScene shell is implemented as a standalone scene foundation. It is registered and supports Esc back. It is not inserted into the normal Character Select -> Battle flow yet.

Phase 9-8 updates EquipmentSelectScene to support local P1/P2 equipment selection state (row focus + left/right cycling + description display).

Phase 9-9 connects EquipmentSelectScene to BattleScene via equipment ID scene-data handoff. Equipment IDs are accepted and resolved in BattleScene with safe fallback to `none`, and still have no gameplay effect.

Phase 9-10 preserves selected equipment IDs through match-end navigation (Battle -> Result, Result R rematch, Result C return, CharacterSelect confirm-forward, and EquipmentSelect Esc back).

Phase 9-11 persists last selected equipment IDs in `instrument-brawl:settings` (`lastSelected.player1EquipmentId` / `lastSelected.player2EquipmentId`). Old or invalid settings values safely fall back to `none`. Records schema remains unchanged. Equipment is still gameplay-neutral, and Battle HUD labels / Result display / effects are still not implemented.

Phase 9-11 fix: CharacterSelectScene now uses stored equipment IDs when scene data does not provide them, while still giving priority to explicit scene-data equipment IDs.

Phase 9-12 adds Battle HUD equipment labels (`P1 Equip` / `P2 Equip`) using resolved equipment short labels. Labels are display-only: no gameplay effect. Result equipment display and Amp visual accent are still not implemented.

Phase 9 guardrails:

- no damage/range/defense buffs
- no critical/guard/just-guard/specials/combos
- no timer/rounds/retire runtime additions in this phase-start docs step
- no equipment-specific records schema/analytics
- preserve existing Phase 8 gameplay/system guardrails

**Next recommended task:** Phase 9-13: Result equipment display.

## Play online

GitHub Pages deployment URL:

https://piyoyoshin.github.io/instrument-brawl/

## Local development

```sh
npm run dev
```

Open http://localhost:5173 after the dev server starts.

## Build

```sh
npm run build
```
