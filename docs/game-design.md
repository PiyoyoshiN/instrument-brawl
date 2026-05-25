# Game Design

## Core concept

Instrument Brawl is a browser-based 1v1 physics fighting game where musical instruments fight each other.

The tone should be funny, loose, and chaotic. The goal is to feel closer to Sausage Legend than a serious competitive fighting game: simple inputs, floppy physics, exaggerated hits, and quick rematches.

## Current playable state

The game is currently a simple local 1v1 prototype built with Phaser, Vite, and TypeScript.

- CharacterSelectScene lets players choose from the current fighter registry.
- Current selectable fighters: Electric Guitar, Bass, Drum Sticks, and Keyboard.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R starts a rematch from the result screen.
- C returns from ResultScene to CharacterSelectScene with selected fighter IDs preserved.
- HP bars and clearer HP text are implemented.
- Hit flash is implemented.
- Velocity-based knockback is implemented.
- Visible-duration attack hit detection is implemented.
- One attack causes only one hit.
- HomeScene, ModeSelectScene, CharacterSelectScene, BattleScene, and ResultScene provide the current match flow.
- BattleScene shows a short Ready/Fight prompt before fighters can move or attack.

## Initial MVP

The first MVP focused on a single playable match with:

- Two fighters on one arena.
- Local 1v1 play on the same keyboard.
- Simple physics-driven movement.
- One basic attack per fighter.
- HP for each fighter.
- Knockback when attacks connect.
- A clear win/loss result when one fighter reaches 0 HP.
- Fast restart after a match ends.

This MVP is complete.

## Basic controls

Keep controls simple so the game is easy to test and tune.

### Character select

- P1 A / D: choose fighter.
- P2 Left / Right: choose fighter.
- Enter / Space: start battle.
- Escape: return Home.

### Mode select

- Left / Right or Up / Down: choose mode.
- Enter / Space: confirm and open CharacterSelectScene with `player2Mode`.
- Escape: return Home.

### Player 1 battle controls

- A / D: move.
- W / Space: attack.

### Player 2 battle controls

- Left / Right: move.
- Up / Enter: attack.

Movement should be intentionally a little awkward and physics-based. Attacks should be easy to trigger, but the results can be silly and unpredictable.

## Battle rules

- Each match is 1v1.
- Both players start with full HP.
- An attack deals damage when the striking part of the instrument hits the opponent.
- One attack can hit only once.
- Hits should apply velocity-based knockback.
- Hits briefly flash the damaged fighter.
- The first player to reduce the opponent's HP to 0 wins.
- If both fighters reach 0 HP at nearly the same time, show a draw.
- Matches should be short and restart quickly.
- Starting a match should briefly pause on a clear Ready/Fight prompt so both players know when control begins.

## Balance philosophy

Instrument Brawl should not over-normalize fighters. The goal is funny, readable, replayable imbalance with clear strengths and weaknesses, not tournament-level fairness.

Balance changes should keep the game easy to understand and quick to rematch. A fighter can be weird, awkward, or lopsided if that personality is readable and funny.

## Core band fighters

Phase 3 core band fighter expansion is complete. The implemented roster is Electric Guitar, Bass, Drum Sticks, and Keyboard.

### Electric Guitar

- Already implemented.
- Faster standard fighter.
- HP: 100.
- Move speed: 260.
- Damage: 10.
- Knockback speed: 520.
- Uses a sharper horizontal attack hitbox.
- Should feel sharp, loud, and slightly wild.

### Bass

- Already implemented.
- Slower heavier fighter.
- HP: 105.
- Move speed: 230.
- Damage: 10.
- Knockback speed: 580.
- Uses a taller/heavier attack hitbox.
- Should feel weighty and funny when it swings around.

### Drum Sticks

- Implemented in Phase 3-2.
- Lightweight, fast, short-reach fighter.
- HP: 80.
- Move speed: 310.
- Damage: 8.
- Knockback speed: 420.
- Should feel quick, pokey, and fragile.
- Does not introduce multi-hit; one attack still hits only once.

### Keyboard

- Implemented in Phase 3-6.
- Wide, awkward, area-control fighter.
- HP: 95.
- Move speed: 215.
- Damage: 9.
- Knockback speed: 500.
- Body dimensions: 112 x 70.
- Attack shape: width 118, height 46, Y offset 0.
- Should feel physically annoying and reach-heavy without adding special systems.

## Phase 3 completion notes

Phase 3 stayed intentionally small: local 1v1 only, simple rectangle prototype visuals, one attack per fighter, one attack hitting only once, and same-character selection allowed. It avoided CPU, BGM/SE, story, encyclopedia, progression, specials, items, timer, rounds, retire button, and new non-core fighters.

The next planned direction is Phase 4 solo play preparation, presentation/polish, and audio-ready structure without audio assets, not more Phase 3 roster expansion.

## Phase 4 design direction

Phase 4 is not only visual polish. It should prepare solo play, improve presentation, and plan an audio-ready structure without committing audio assets yet.

### Minimal P1 vs CPU mode design

CharacterSelectScene keeps local 2-player mode as the default and includes a small P2 mode choice with two options: Human and CPU. P1 and P2 fighter selection continue to use the existing fighter registry, and same-character selection remains allowed for both Human and CPU modes.

Scene data carries the P2 mode alongside the existing fighter IDs:

- `player1FighterId`.
- `player2FighterId`.
- `player2Mode`, using a simple value such as `human` or `cpu`.

CharacterSelectScene passes `player2Mode` to BattleScene when starting a match. BattleScene passes the same value to ResultScene when the match ends. ResultScene rematch preserves the selected fighters and `player2Mode`; returning to CharacterSelectScene with C also preserves the selected fighters and `player2Mode`.

### Minimal CPU behavior

- Implemented in Phase 4-3.
- CPU controls P2 only.
- CPU does not act before the Ready/Fight start prompt enables the match.
- CPU does not act after `matchOver`.
- CPU moves toward P1 when far away.
- CPU attacks when close enough.
- CPU can optionally back away sometimes so it feels less robotic.
- CPU uses existing fighter stats.
- CPU uses the existing attack cooldown, attack duration, one-hit-per-attack rule, HP, hit flash, knockback, win/draw detection, and ResultScene flow.
- No difficulty settings, learning AI, strong prediction, perfect avoidance, or CPU-only stat changes are added yet.
- Phase 4-4 sanity pass keeps the CPU minimal and lightly reduces its comfort distance so short-reach fighters keep approaching until they can actually attack.

### Audio-ready planning

- Phase 4-6 defines the audio policy without adding audio assets.
- Do not add BGM/SE audio files yet.
- Later Phase 4 work may prepare audio structure such as `public/assets/audio/bgm` and `public/assets/audio/sfx`.
- Future audio sources must be safe for a public GitHub repository: self-made, CC0, or properly credited licensed assets such as CC-BY when credits are handled.
- Do not commit commercial songs, existing game BGM, YouTube audio, unclear-license files, or ear-copy recreations of copyrighted tracks.
- Lightweight audio settings such as `soundEnabled` and `masterVolume` may be planned later, but do not build a full settings screen yet.
- See `docs/audio-policy.md` for the repository audio policy.

### Early Phase 4 guardrails

- Keep the current implemented state consistent: four selectable fighters, local 1v1, simple rectangle prototype visuals, one attack hitting only once, and same-character selection allowed.
- Phase 4-7 lightly improves menu labels, helper text, and result readability while keeping scene flow and controls unchanged.
- Phase 4-8 lightly improves BattleScene arena readability with clearer floor/platform separation, subtle background guide lines, and simple rectangle grounding details.
- Phase 4-9 lightly improves hit and match-end readability with small text/rectangle feedback while preserving damage, HP, knockback, one-hit attacks, and ResultScene flow.
- New fighters, specials, items, progression, story, encyclopedia, timer, rounds, and retire button are not first Phase 4 tasks.
- Keep PRs focused: 1 PR = 1 feature.
- Keep the balance philosophy: do not over-normalize fighter differences.

## Phase 4 checkpoint notes

Phase 4 currently has local 2P as the default, optional P2 CPU mode, four selectable fighters, preserved P2 mode through BattleScene and ResultScene flows, minimal CPU behavior with a sanity pass, audio policy without assets, and light menu/arena/hit/result polish.

The game still intentionally avoids new fighters, specials, items, progression, story, encyclopedia, timer, rounds, retire button, BGM/SE audio files, settings screen, and online play.


Next recommended direction is Phase 5 foundation cleanup, Quick Help planning, and roadmap alignment. Do not add new gameplay yet unless a focused task explicitly asks for it.

## Phase 5 design direction

Phase 5 is not a gameplay expansion phase. It should focus on foundation cleanup, compact Quick Help planning, and full roadmap alignment.

Do not add a full tutorial yet. Future help should be a compact in-battle Pause / Quick Help overlay that can quickly remind players of controls, P2 Human/CPU mode, and basic match rules without adding a tutorial scene or practice mode.

### Pause / Quick Help overlay design

Quick Help should be a compact in-battle overlay, not a full tutorial. Use `P` as the proposed toggle key; current controls do not use `P`.

The overlay should fit on one screen and show only essential information:

- Resume: `P`.
- P1 controls: `A` / `D` move, `W` / `Space` attack.
- P2 Human controls: `Left` / `Right` move, `Up` / `Enter` attack.
- P2 CPU: controlled automatically.
- Current P2 mode: Human or CPU.
- One attack can hit only once.
- Wait for Ready / Fight before control starts.
- Result controls: `R` rematch, `C` character select, `Enter` / `Space` Home.

Expected pause behavior for implementation:

- Pause should stop movement.
- Pause should stop new attacks.
- Pause should stop CPU behavior.
- Pause should stop active attack updates.
- Pause should not break Ready / Fight, `matchOver`, ResultScene transition, R rematch, or C return-to-character-select.

Forfeit / Retire, Timer, Rounds, Practice mode, TutorialScene, and Settings are not part of this task.

### Current Phase 6 presentation/effects note

Current feedback stack in BattleScene is visual-only:

- Attack color variation.
- Hit flash.
- Small hit spark.
- `HIT -damage` marker.
- `CLEAN HIT` sub-label.
- Tiny hit shake on confirmed hit.
- Small win/draw effect at match end.

These are effects trials only and do not change gameplay values/logic.


### Future combat/effect identity hook

Current hit effects are intentionally shared visual-only trials. In later phases, hits should feel different by future attack impact class rather than treating all attacks the same.

Future identity direction:

- `direct-heavy`: heavier physical impact feel.
- `direct-medium`: standard sharp direct-hit feel.
- `direct-light`: lighter/snappier direct-hit feel.
- `sonic`: waveform/ranged-style feedback with little/no shake.
- `hybrid`: mixed direct + sonic accents.

This is planning only. No impact-class implementation or gameplay tuning is part of current Phase 6.


### Phase 7 checkpoint note

Phase 7 checkpoint is complete with the following scope:

- Home / Mode Select / Options flow is implemented (Home includes Start/Options).
- Local 2P and P1 vs CPU selection is now handled in Mode Select.
- Keep existing CharacterSelectScene P2 Human/CPU toggle for now.
- localStorage settings are implemented for preferences and last selected fighters/mode.
- Effects ON/OFF and screen shake ON/OFF are implemented and saved.
- Lightweight Records foundation planning.
- Server saving deferred until online/account scope exists.

Gameplay values/logic remain unchanged. Records runtime and reset-preferences/reset-records remain future implementation scope.


### Phase 7 scene flow direction

Current implemented flow:

- `HomeScene -> ModeSelectScene -> CharacterSelectScene -> BattleScene -> ResultScene`

Scene role intent:

- Home: game entrance, with Start + future Options (+ possible future lightweight Records entry).
  - Home Start routes to ModeSelectScene.
- Mode Select: clear Local 2P vs P1 CPU choice before Character Select.

Mode Select mapping:

- Local 2P -> `player2Mode: "human"`
- P1 vs CPU -> `player2Mode: "cpu"`
- Mode Select starts CharacterSelectScene with `{ player2Mode }` (button click/tap or keyboard confirm).
- Suggested controls: Up/Down or Left/Right choose, Enter/Space confirm, Escape return Home.
- Character Select: fighter selection; keep existing P2 Human/CPU toggle as fallback/manual override for now.
  - If Mode Select chose Local 2P, Character Select should initially show Human.
  - If Mode Select chose P1 vs CPU, Character Select should initially show CPU.
- Battle: consume selected fighters and P2 mode from scene data.
- Result: preserve fighters and P2 mode through rematch/return flows.

ModeSelectScene behavior is implemented. Options/localStorage settings are implemented, and Records runtime is implemented (storage, scene shell, once-per-match recording, and reset flow).

Later phase direction:

- Phase 6: effects trial and presentation experiments (see `docs/phase-6-effects-trial.md`).
- Phase 7: game shell direction for Home / Mode / Options and localStorage-based save planning.
- Phase 8: match rule expansion consideration such as Retire / Timer / rounds, without rushing rounds.
- Phase 9: encyclopedia, records, and light worldbuilding.
- Phase 10+: specials, items, new fighters, and larger content expansion.


### Phase 8 scope: Records / Reset / Match Rule & Equipment Planning

Phase 8 is not a major combat expansion phase.

Implementation targets in later Phase 8 tasks:

- Reset Preferences
- Records localStorage utility
- Save match result once
- RecordsScene shell
- Home Records entry
- Reset Records
- Playtest checklist updates

Docs/design-only targets in Phase 8:

- Retire / Forfeit
- Timer
- Equipment / Amp
- `attackMethod` / `impactClass`
- Critical rate / guard / just guard as future topics only

Immediate non-goals:

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

Phase 8 scope/docs guardrails (must not change in these tasks): HP, damage, knockback, attack cooldown, attack duration, hitbox, CPU behavior, and one-hit-per-attack.

Next recommended task: **Phase 9-13: Result equipment display**.

### Phase 8-3 Reset Preferences design (docs only)

Reset Preferences in Phase 8 is settings-only.

Design constraints:

- Operate only on `instrument-brawl:settings`
- Do not modify `instrument-brawl:records`
- Keep Reset Preferences and Reset Records as separate actions
- Do not introduce a combined reset-all action in this phase

Reset target defaults:

- `player1FighterId`: `electric-guitar`
- `player2FighterId`: `bass`
- `player2Mode`: `human`
- `effectsEnabled`: `true`
- `screenShakeEnabled`: `true`

Future OptionsScene UX:

- Add a separate Reset Preferences row
- Use simple two-step confirm (first press arms, second press executes)
- Show a compact hint such as `Press again to confirm`
- Escape or moving selection cancels the armed state
- No modal system design in this phase

Expected behavior:

- Defaults are saved back to settings storage
- Mode Select and Character Select default state is restored (unless explicit scene data override exists)
- Options shows Effects ON + Screen Shake ON
- Gameplay values/logic do not change

Failure behavior:

- localStorage unavailable/failure must fail safely
- No gameplay crash on reset failure
- Existing sanitize/default behavior remains fallback


### Phase 8-5 Records runtime design (docs only)

Records are local-only runtime counters.

Storage separation:

- settings: `instrument-brawl:settings`
- records: `instrument-brawl:records`
- both keys stay separate by design

Initial records shape (`version: 1`):

- `totalMatches`, `p1Wins`, `p2Wins`, `draws`
- `cpuMatches`, `local2pMatches`
- `lastPlayedAt` (nullable; default `null`)

Default values start at zero (and `lastPlayedAt: null`).

Counting rules:

- completed match increments `totalMatches` once
- increment one of `p1Wins` / `p2Wins` / `draws`
- increment `cpuMatches` for CPU mode, `local2pMatches` for Human mode
- set `lastPlayedAt` to ISO timestamp string
- do not store per-hit, damage history, replay, or deep analytics

Double-count prevention is the top rule:

- each completed match is persisted once
- rematch, return-to-character-select, and return-home from Result must not duplicate the previous match
- future implementation should include a minimal once-only guard flag

Preferred future save point:

- save exactly once when ResultScene is first entered
- keep BattleScene as result source only
- this keeps write timing centralized and reduces duplicate-write risk

Fallback/sanitize behavior:

- no localStorage / parse error / invalid payload -> safe empty defaults without crash
- unknown version -> safe fallback for now
- invalid records handling must not delete settings
- Reset Preferences must not delete records

Out of scope:

- achievements/trophies/unlocks
- encyclopedia/story progress
- online rank/matchmaking/account stats
- replay data, damage logs, per-fighter deep analytics
- server/cloud persistence


### Phase 8-10 Reset Records design (docs only)

Reset Records is records-only and separate from Reset Preferences.

Design constraints:

- Operate only on `instrument-brawl:records`
- Do not modify `instrument-brawl:settings`
- Keep Reset Records and Reset Preferences as separate actions
- Do not introduce Reset All in this phase

Reset target defaults:

- `version: 1`
- `totalMatches: 0`
- `p1Wins: 0`
- `p2Wins: 0`
- `draws: 0`
- `cpuMatches: 0`
- `local2pMatches: 0`
- `lastPlayedAt: null`

Future RecordsScene UX:

- Add a separate Reset Records row
- Use simple two-step confirm
- Show hint: `Reset Records: Press again to confirm`
- Escape or moving selection cancels armed state
- No modal/admin menu design in this phase

Expected behavior:

- Records values reset immediately in RecordsScene (zeros + `Last Played: Never`)
- Settings state remains unchanged
- Reset Preferences behavior remains unchanged
- Gameplay values/logic do not change

Failure behavior:

- localStorage unavailable/failure must fail safely
- no gameplay crash on reset failure
- sanitize/default records behavior remains fallback
- invalid records must not delete settings


### Phase 8-12 Retire / Forfeit design (docs only)

Retire/Forfeit is a future voluntary early-end option, not a complex rule system.

Design intent:

- simple escape hatch for stuck/boring/clearly lost matches
- no timer/round coupling
- compact UX only

Winner/result behavior (future):

- P1 retire -> P2 win
- P2 Human retire -> P1 win
- In CPU mode, only human P1 can retire for now
- CPU does not retire
- no retire draw path
- keep ResultScene flow and `p1`/`p2` result kind

Records behavior (future):

- retire counts as normal completed match
- `totalMatches` + mode split + winner counters increment once
- `lastPlayedAt` updates
- existing once-per-result guard still prevents double-counting
- no retire-specific counters yet

Future UI/control/timing direction:

- location: Pause / Quick Help overlay
- two-step confirm (`Retire: Press again to confirm`)
- cancel via `P` resume/cancel (and selectable-overlay cancel path later if needed)
- do not reuse `R` battle key
- retire only after Fight/matchStarted
- retire disabled after `matchOver`

Result text direction:

- keep simple labels like `P1 Retired - P2 Wins`
- no new result bucket now

Out of scope:

- no retire implementation in this docs task
- no pause implementation change in this docs task
- no timer/rounds/surrender stats/retire achievements/penalties
- no online/disconnect or CPU retire AI
- no server/cloud persistence


### Phase 8-13 Timer design (docs only)

Timer is a future optional pacing tool, not a Phase 8 implementation task.

Design intent:

- reduce dragged-out matches
- keep matches quick/silly/replayable
- avoid competitive over-structuring
- do not introduce rounds in Phase 8

Optional status and duration direction:

- keep no-timer as current baseline
- timer not default-enabled yet
- candidate default duration: 60 seconds
- later candidates: 45 seconds / 90 seconds
- no timer settings/custom duration UI in Phase 8

Timeout resolution (future):

- higher remaining HP wins
- equal HP -> draw
- existing combat KO/draw behavior remains valid
- continue using existing ResultScene flow and `p1`/`p2`/`draw`
- no timeout-only result bucket now

Records behavior on timeout (future):

- counts as normal completed match
- normal counters and mode split increment once
- `lastPlayedAt` updates
- once-per-result guard still prevents duplicate counting
- no timer-specific record fields in Phase 8

Future UI/pause/retire interactions:

- compact top-center timer text in BattleScene
- no heavy animation/audio countdown
- pause/help freezes timer
- timer starts after Ready/Fight control begins
- timer stops after `matchOver`
- retire and timer remain separate; first resolved event decides result

Out of scope:

- no timer implementation in this docs task
- no timer UI/settings implementation
- no rounds/sudden death/overtime/time bonus
- no timer-specific records fields
- no online/server timer sync
- no tournament/competitive rule expansion


### Phase 8-14 Equipment / Amp design (docs only)

Equipment is a future optional match-customization layer.

Design intent:

- keep variety funny/readable
- avoid deep RPG/progression systems
- preserve quick local replayability
- keep no-equipment baseline as default

Future structure direction:

- eventual 0-or-1 support equipment per player
- chosen around Character Select in a later phase
- match-local scope only
- no server/account/progression dependency

Amp candidate direction:

- first support-equipment concept
- sound boost/projection flavor
- possible later sonic/ranged-feeling behavior
- Phase 8 remains design-only (no Amp gameplay implementation now)

Candidate options (for later experiments):

- visual sound-wave presentation only
- presentation variation on attack
- possible future reach modifier
- possible future sonic/ranged attack-method variant
- possible tradeoff if range is added later

Guardrails:

- do not erase fighter identity
- avoid large damage spikes
- no critical/guard/just-guard/special additions in Phase 8
- no rounds/timer dependency requirement

Future UI direction:

- candidate: `Equipment: None` / `Equipment: Amp`
- simple left/right selection
- same-equipment mirror match readability should remain clear
- Character Select must remain usable without equipment
- do not implement in this docs task

Records direction:

- no equipment records fields/analytics in Phase 8
- keep normal records counters only

Relation to `attackMethod` / `impactClass`:

- may reference these categories later
- defer detailed category docs to Phase 8-15

Out of scope:

- no equipment/amp implementation
- no equipment UI/storage/records schema changes
- no ranged/sonic projectiles
- no combat value/hitbox/cooldown/startup changes
- no critical/guard/just-guard/special systems
- no unlock/loot/currency/progression systems
- no assets/sprites/3D/BGM/SE
- no online/server/account features

### Phase 8-15 attackMethod / impactClass design (docs only)

Purpose:

- `attackMethod` describes future delivery style.
- `impactClass` describes future impact/hit-feel style.
- both are documentation labels first (readability/effects/equipment planning/balance vocabulary).
- labels do not alter gameplay by themselves.
- labels are not records/settings fields in Phase 8.

`attackMethod` future candidate values (design only):

- `direct`
- `sonic`
- `ranged`
- `hybrid`

Suggested meaning:

- `direct`: close/contact baseline
- `sonic`: sound-wave/vibration style delivery
- `ranged`: projectile/distance delivery (later phase)
- `hybrid`: mixed direct + sonic/ranged style

`impactClass` future candidate values (design only):

- `physical`
- `sound`
- `burst`
- `technical`

Suggested meaning:

- `physical`: solid contact feel
- `sound`: vibration/sound-pressure feel
- `burst`: short explosive/flashy feel
- `technical`: precise controlled utility-like feel

Difference examples (non-binding):

- `direct + physical`
- `sonic + sound`
- `ranged + burst`
- `hybrid + technical`

Current fighter relation:

- Electric Guitar / Bass / Drum Sticks / Keyboard remain unchanged runtime baseline.
- no final per-fighter category assignment in this task.
- no attack behavior updates in this task.

Relation to Amp/Equipment:

- Amp may later experiment with `sonic`/`ranged`/`hybrid`.
- Amp may later align with `sound` impact flavor.
- this is not a commitment to ranged Amp implementation.

Future use cases (later phases):

- effects direction
- docs/UI attack descriptions
- equipment planning
- balance discussion language
- future fighter differentiation

Not used yet for:

- records/settings fields
- unlocks/achievements/progression
- online/server/account data
- automatic damage formulas

Balance guardrails:

- no automatic buffs from labels
- `ranged` must not be strictly better than `direct`
- later ranged/sonic behavior likely needs tradeoffs
- no final tradeoff tuning in this docs task
- preserve fighter identity readability

Out of scope:

- no TypeScript/runtime implementation
- no FighterDefinition schema updates
- no attackMethod/impactClass runtime fields
- no projectile/sonic runtime behavior
- no damage/knockback/cooldown/duration/hitbox changes
- no critical/guard/just-guard/special systems
- no timer/rounds implementation
- no records/settings schema changes
- no assets/sprites/3D/BGM/SE
- no online/server/account storage

### Phase 7-7 localStorage save foundation (design only)

Storage contract is defined and helper utilities exist. Confirmed selection save and restore to initial Mode/Character UI are implemented.

Planned key and payload:

- Key: `instrument-brawl:settings`
- Payload: lightweight local JSON object with versioning

```json
{
  "version": 1,
  "lastSelected": {
    "player1FighterId": "electric-guitar",
    "player2FighterId": "bass",
    "player2Mode": "human"
  },
  "preferences": {
    "effectsEnabled": true,
    "screenShakeEnabled": true
  }
}
```

Planned load/save rules for later implementation:

- Load is attempted when entering ModeSelectScene / CharacterSelectScene.
- Save happens after confirmed selections (mode/fighter selections are saved).
- If localStorage is unavailable, behavior remains current default behavior.
- If parsing fails or payload shape is invalid, ignore persisted data and use defaults.
- If fighter IDs are not valid registry IDs, replace with default fighter IDs.
- If `player2Mode` is invalid, use `"human"`.
- CharacterSelectScene uses scene data `player2Mode` from ModeSelectScene when provided; otherwise it uses stored mode.
- Keep data local-only; no server save, no account sync.
- Do not store Records data yet (Records remains future scope).



### Phase 7-11 Options preferences scope (design only)

A minimal `OptionsScene` shell is implemented in Phase 7-12. It supports toggling and saving two local preferences only.

Planned Option items (future):

- Effects ON/OFF -> `preferences.effectsEnabled`
- Screen Shake ON/OFF -> `preferences.screenShakeEnabled`

Defaults and fallback:

- defaults: `effectsEnabled: true`, `screenShakeEnabled: true`
- if localStorage is unavailable or invalid, use defaults

Planned behavior constraints:

- Changes save on toggle in current minimal OptionsScene implementation
- Effects OFF disables visual-only extras (hit spark, `CLEAN HIT` sub-label, win/draw accent effects).
- Screen Shake OFF disables tiny shake only.
- Screen Shake OFF should not disable other visual effects
- Effects OFF must not change gameplay values/logic (hit detection, damage, knockback, CPU behavior, one-hit-per-attack)
- BGM/SE settings are excluded until audio playback/assets are implemented
- Records preferences are excluded in this step



### Phase 7-14 lightweight Records foundation (design only)

Records in Phase 7 started as planning-only foundation work; runtime implementation was completed in Phase 8.

Future scope intent:

- local-only, lightweight match summaries
- no gameplay effects
- no fighter/item unlock effects
- no online/account/server dependency

Candidate future fields:

- `totalMatches`, `p1Wins`, `p2Wins`, `draws`
- `cpuMatches`, `local2pMatches`
- `lastPlayedAt`
- optional later: per-fighter pick counts

Not tracked in this foundation scope:

- achievements/trophies/unlocks
- encyclopedia/story progression stats
- online rank/matchmaking/account stats
- detailed battle logs/per-hit analytics/damage history/replay data

Future storage direction:

- keep settings in `instrument-brawl:settings`
- prefer separate records key `instrument-brawl:records`
- include a version field
- sanitize invalid records values
- use empty/default records when localStorage is unavailable/invalid

## Later candidate ideas

These are later ideas only, not Phase 3 fighters:

- Microphone.
- Piano.
- Bongo.
- Tambourine.

## Not Phase 3 tasks

- CPU opponent.
- BGM/SE.
- Story.
- Encyclopedia.
- Progression.
- Specials.
- Items.
- Timer.
- Rounds.
- Retire button.
- Online multiplayer.
- Complex combo systems.
- Ranked or competitive systems.
- Advanced AI opponents.
- Large story mode.
- Unlocks or inventory.
- Final art, animation, or sound polish.


### Phase 9 design direction: Equipment shell + attack identity foundation

Phase 9 starts as shell/foundation work, not a combat buff phase.

Equipment model direction:

- each player can have 0 or 1 support equipment
- future candidates: No Accessory (`none`), Amp (`amp`), Pick (`pick`), Case (`case`)
- equipment identity should stay lightweight/readable and optional

Amp direction:

- Amp may later reference sonic/ranged/hybrid language
- Phase 9 does not guarantee ranged implementation
- no runtime ranged/sonic attack behavior in this docs step
- ResultScene equipment labels are now visible (`P1 Equip` / `P2 Equip`) as display-only status text with no gameplay effect
- Amp now has a subtle BattleScene-only visual accent when selected, and it remains gameplay-neutral

Attack identity direction:

- `attackMethod` / `impactClass` remain planning language unless explicitly implemented in a later runtime task
- no schema/runtime behavior changes in this docs step

Guardrails:

- preserve Phase 8 gameplay/system invariants
- no combat value tuning or records schema expansion for equipment

### Phase 9-15 future equipment effect direction (docs only)

Future direction only (not implemented):

- Amp may later explore sonic / ranged / hybrid / signal-style identity.
- Pick may later explore precision / close-range / timing-style identity.
- Case may later explore protection / setup / stability-style identity.

Rules for future equipment effect implementation:

- Any equipment gameplay effect must be an explicit future phase task.
- Introduce effects one at a time with isolated playtest checklist items.
- Do not modify settings/records schema unless a future explicit schema task says so.
- Equipment-specific records/analytics remain out of scope for now.
- Inventory/unlocks/rarity/currency/progression remain out of scope for now.

Phase 9 ended with display/identity foundation only: labels, handoff, persistence, and Amp visual-only accent. Equipment remains gameplay-neutral.

Next recommended task: **Phase 10-1: Phase 10 scope docs**.

### Phase 10 equipment interaction matrix (implemented reference)

This section describes **currently implemented** Phase 10 prototype behavior only.
Future ideas are out of scope unless explicitly listed below.

#### Equipment baseline

| Equipment | Compatibility | Implemented behavior |
| --- | --- | --- |
| `none` | All fighters | Baseline behavior with no equipment effect. |
| `amp` | Electric Guitar / Bass / Keyboard | Small reach bonus only. No damage increase, no knockback/cooldown/duration/speed/HP/defense changes. Non-projectile, non-screen-wide, non-multi-hit. |
| `amp` + Drum Sticks | Incompatible | Resolved to `none` before battle behavior. |
| `case` | All fighters | Defender-side normal damage reduction: `floor(baseDamage * 0.8)`, then clamp minimum 1. Critical damage is not reduced. No knockback reduction, HP increase, or guard behavior. |
| `pick` | All fighters | Selectable/displayed only. No Phase 10 gameplay effect (`準備中` candidate). |

Additional Case attacker-side rule:

- Drum Sticks + Case loses high-critical identity (does not critical).

#### Fighter x equipment interaction rules

- Electric Guitar:
  - + `none`: baseline (normal 10 damage against non-Case).
  - + `amp`: small reach bonus only; no damage increase.
  - + `case`: receives Case defensive reduction when hit; own attack remains normal 10; no critical.
  - + `pick`: no gameplay effect.
- Bass:
  - + `none`: baseline (normal 10 damage against non-Case).
  - + `amp`: small reach bonus only; no damage increase.
  - + `case`: receives Case defensive reduction when hit; own attack remains normal 10; no critical.
  - + `pick`: no gameplay effect.
- Keyboard:
  - + `none`: baseline (normal 9 damage against non-Case).
  - + `amp`: small reach bonus only; no damage increase.
  - + `case`: receives Case defensive reduction when hit; own attack remains normal 9; no critical.
  - + `pick`: no gameplay effect.
- Drum Sticks:
  - + `none`: base 8, can critical at 35%, critical damage 12, critical bypasses defender Case.
  - + `amp`: incompatible, resolved to `none` before battle behavior.
  - + `case`: no critical in this prototype; normal 8 vs non-Case, 6 vs Case defender; still receives defensive Case reduction when hit.
  - + `pick`: Pick has no gameplay effect; Drum Sticks can still critical because Pick is not Case.

#### Damage examples (expected)

- Electric Guitar/Bass normal vs none: 10.
- Electric Guitar/Bass normal vs Case: 8.
- Keyboard normal vs none: 9.
- Keyboard normal vs Case: 7.
- Drum Sticks + none normal vs none: 8.
- Drum Sticks + none critical vs none: 12.
- Drum Sticks + none normal vs Case: 6.
- Drum Sticks + none critical vs Case: 12.
- Drum Sticks + Case vs none: 8.
- Drum Sticks + Case vs Case: 6.
- Drum Sticks + Pick normal vs Case: 6.
- Drum Sticks + Pick critical vs Case: 12.

#### Phase 10 guardrails still in effect

- No Pick gameplay effect.
- No Amp projectile or separate echo hitbox.
- No screen-wide attack.
- No multi-hit behavior.
- No knockback reduction.
- No HP increase.
- No guard / just guard.
- No special moves or combo system.
- No equipment-specific records, critical-count records, or damage-dealt records.
- No equipment win-rate analytics.
- No `instrument-brawl:records` schema changes.
- No `instrument-brawl:settings` schema changes.
- No new assets/audio/images/3D for this ruleset.

### Japanese UI label policy / 日本語UIラベル方針 (docs-only plan)

This section is a **documentation policy only** for future UI wording work.
It does not implement runtime UI changes in this step.

#### 1) General policy

- Player-facing labels should gradually move toward Japanese.
- Internal code identifiers, TypeScript types, fighter IDs, equipment IDs, and localStorage schema names can remain English.
- Do not rename internal IDs just to change visible UI wording.
- Apply Japanese wording at display/rendering boundaries (scene text, HUD text, result text, menu labels).
- Future runtime UI label changes should be small and reversible (1 PR = 1 low-risk surface when possible).

#### 2) Fighter label policy (planned display)

| Internal fighter ID | Planned Japanese display | Short label candidate |
| --- | --- | --- |
| `electric-guitar` | `エレキギター` | `エレキ` |
| `bass` | `ベース` | `ベース` |
| `drum-sticks` | `ドラムスティック` | `ドラム` |
| `keyboard` | `キーボード` | `キーボード` |

#### 3) Equipment label policy (planned display)

| Internal equipment ID | Planned Japanese display | Short label candidate | Notes |
| --- | --- | --- | --- |
| `none` | `装備なし` | `なし` | Baseline/no effect. |
| `amp` | `アンプ` | `アンプ` | Reach-only prototype in current Phase 10 runtime. |
| `case` | `ケース` | `ケース` | Defender-side normal damage reduction prototype. |
| `pick` | `ピック（準備中）` | `ピック` | `準備中` wording candidate for future disabled/no-effect explanation; gameplay effect remains not implemented in Phase 10. |

#### 4) Battle feedback label policy (planned display direction)

- Normal hit:
  - Current runtime can keep `HIT -X` for now.
  - Japanese display candidate: `ヒット -X`.
- Clean hit sublabel:
  - Current runtime can keep `CLEAN HIT` for now.
  - Japanese display candidate: `ヒット！`.
- Critical hit:
  - Keep `会心！` as the primary Japanese critical label.
- Keep battle text short; avoid long sentences that reduce combat readability.

#### 5) Scene/UI label policy (planned display direction)

- Equipment Select:
  - `Equipment Select` -> `装備選択`
  - `P1 Equip` -> `P1 装備`
  - `P2 Equip` -> `P2 装備`
- Character Select:
  - Candidate: `キャラクター選択` or `キャラ選択`
- Result:
  - Equipment display should eventually use Japanese equipment labels.
- Settings / Records:
  - Display wording can be Japanese.
  - Storage keys/schema names must remain unchanged.

#### 6) Guardrails for this policy step

- No runtime changes in this PR.
- No `instrument-brawl:settings` schema changes.
- No `instrument-brawl:records` schema changes.
- No ID/type renames.
- No asset/font/image/audio/3D additions.
- No gameplay or balance changes.
- No equipment-effect behavior changes (including Pick effect).

#### 7) Safe future implementation order

1) Add centralized display-label maps/helpers first.  
2) Switch low-risk UI labels in small PRs:
   - EquipmentSelect visible labels
   - Battle HUD equipment labels
   - ResultScene equipment labels
3) Review battle feedback wording (`会心！`, `ヒット`) in a dedicated small step.  
4) Keep internal IDs/storage unchanged throughout.

### Pick「準備中」UI wording plan / Pick no-effect wording plan (docs-only plan)

This section defines future UI wording policy for Pick in Phase 10.
It is documentation-only and does not change runtime behavior in this step.

#### 1) Pick current rule (implemented runtime baseline)

- `pick` remains selectable/displayed in Phase 10.
- `pick` has no gameplay effect in Phase 10.
- `pick` does not change damage.
- `pick` does not change range.
- `pick` does not change critical rate.
- `pick` does not change defense.
- `pick` does not change cooldown.
- `pick` does not change movement speed.
- `pick` does not change HP.
- `pick` does not add records/analytics.

#### 2) Player-facing wording goal

- UI wording should avoid implying that Pick already has an active gameplay effect.
- Wording should communicate “not implemented yet” without sounding like an error state.
- Wording should stay short enough for Equipment Select / HUD / Result surfaces.
- Avoid long explanatory text in battle HUD to preserve readability.

#### 3) Planned Japanese labels

- Full equipment label: `ピック（準備中）`
- Short label: `ピック`
- Status label: `準備中`
- Description/help text candidates:
  - `効果はまだありません`
  - `今後追加予定`
  - `このフェーズでは効果なし`
- Recommended default for Equipment Select:
  - show `ピック（準備中）` or `ピック` + small `準備中`
- Recommended default for Battle HUD / Result:
  - use compact `ピック`
  - avoid long status text during battle
- Recommended default for details/help text:
  - use `このフェーズでは効果なし`

#### 4) Selection behavior policy

- Pick should remain selectable.
- Selecting Pick should not crash.
- Selecting Pick should not silently become another equipment.
- Pick should not be treated as invalid.
- Pick should not trigger fallback to `none`.
- Pick should be displayed honestly as selected, while described as no-effect/`準備中`.
- Reset Preferences should continue resetting equipment to `none`.

#### 5) Safe future implementation order

1) Add centralized Japanese equipment display-label helper/map.  
2) Add optional equipment description/help text surface.  
3) Update EquipmentSelect visible wording for Pick first.  
4) Optionally update Battle/Result to compact Japanese labels.  
5) Keep Pick gameplay no-effect until a dedicated future gameplay task.  
6) Add checklist coverage after runtime UI wording changes.

#### 6) Guardrails for this policy step

- No runtime changes in this PR.
- No Pick gameplay effect.
- No damage/range/critical/defense/cooldown/speed/HP changes.
- No fallback behavior changes.
- No internal ID renames.
- No storage key/schema changes.
- No records schema changes.
- No equipment analytics additions.
- No assets/audio/images/3D or font additions.
- No gameplay/balance changes.

### Phase 10 prototype checkpoint / current implemented state

This section is a concise snapshot of the **currently implemented** Phase 10 prototype state after Phase 10-18.
It is not a go/no-go decision and does not introduce runtime changes in this step.

#### 1) Current scene flow

- Home
- Mode Select
- Character Select
- Equipment Select
- Battle
- Result

Notes:

- Equipment selection is now part of the normal gameplay flow.
- Equipment labels are visible on Battle HUD and Result surfaces.
- Internal IDs/types/storage keys remain unchanged.

#### 2) Current equipment state

- `none`
  - Compatible with all fighters.
  - No gameplay effect.
- `amp`
  - Compatible with Electric Guitar / Bass / Keyboard.
  - Incompatible with Drum Sticks.
  - Drum Sticks + Amp resolves safely to `none` before battle behavior.
  - Current effect is +24px reach bonus only.
  - No damage increase, no projectile, no multi-hit.
  - No knockback/cooldown/speed/HP changes.
- `case`
  - Compatible with all fighters.
  - Reduces normal incoming damage by 20%.
  - Formula: `floor(baseDamage * 0.8)`, then clamp minimum 1.
  - Does not reduce critical damage.
  - Does not reduce knockback.
  - Does not increase HP.
  - Does not add guard / just guard.
- `pick`
  - Selectable/displayed.
  - No Phase 10 gameplay effect.
  - Not invalid.
  - No fallback to `none`.
  - Wording direction is documented as `ピック（準備中）` / `準備中`.

#### 3) Current fighter/equipment identity

- Electric Guitar:
  - Baseline 10 damage.
  - No critical.
  - Amp gives reach only.
  - Case gives defensive reduction only.
- Bass:
  - Baseline 10 damage.
  - No critical.
  - Amp gives reach only.
  - Case gives defensive reduction only.
- Keyboard:
  - Baseline 9 damage.
  - No critical.
  - Amp gives reach only.
  - Case gives defensive reduction only.
- Drum Sticks:
  - Baseline 8 damage.
  - Critical rate is 35%.
  - Critical multiplier is 1.5x.
  - Critical damage is 12.
  - Critical bypasses defender Case reduction.
  - Drum Sticks + Case loses high-critical identity and does not critical.
  - Drum Sticks + Pick can still critical because Pick is no-effect.

#### 4) Current damage examples

- Electric Guitar/Bass vs none: 10.
- Electric Guitar/Bass vs Case: 8.
- Keyboard vs none: 9.
- Keyboard vs Case: 7.
- Drum Sticks + none normal vs none: 8.
- Drum Sticks + none critical vs none: 12.
- Drum Sticks + none normal vs Case: 6.
- Drum Sticks + none critical vs Case: 12.
- Drum Sticks + Case vs none: 8.
- Drum Sticks + Case vs Case: 6.
- Drum Sticks + Pick normal vs Case: 6.
- Drum Sticks + Pick critical vs Case: 12.

#### 5) Current UI/docs state

- Japanese UI label policy is documented.
- Runtime UI is not fully converted to Japanese yet.
- Internal IDs/types/localStorage keys remain English.
- Pick `準備中` wording is documented but not yet implemented as runtime UI wording.
- Battle feedback includes `会心！` for critical hits when effects are enabled.

#### 6) Current guardrails

- No Pick gameplay effect.
- No Amp projectile.
- No Amp echo hitbox.
- No screen-wide attack.
- No multi-hit.
- No knockback reduction.
- No HP increase.
- No guard / just guard.
- No special moves.
- No combo system.
- No records schema changes.
- No settings schema changes.
- No critical count records.
- No damage dealt records.
- No equipment usage analytics.
- No equipment win-rate analytics.
- No assets/audio/images/3D additions.
- No font additions.

#### 7) Known next decision area

Phase 10 is now close to a prototype checkpoint.
The next step (Phase 10-20) should decide whether to:

- keep values as-is for more playtesting,
- adjust one number at a time,
- improve UI clarity,
- or postpone larger mechanics to a later phase.

This document does not make the go/no-go decision.

### Phase 10 post-prototype go/no-go notes

This section is a docs-only decision note after the Phase 10 prototype checkpoint.
It does not add runtime gameplay/UI changes by itself.

#### 1) Overall decision

- Decision: **Conditional GO to next-phase UI clarity / playtest-readiness work.**
- The current equipment prototype is stable enough to proceed to next-phase planning.
- **Not a GO for large new mechanics yet.**
- Keep current values as the baseline for additional playtesting.
- Future changes should remain small, reversible, and one-topic-per-PR.

#### 2) What is considered working enough

- Equipment Select is integrated into the normal flow.
- Equipment labels are visible in Battle/Result surfaces.
- Amp has a small reach-only identity.
- Case has a simple defensive identity.
- Drum Sticks has a high-variance critical identity.
- Drum Sticks + Case has a clear defensive tradeoff.
- Pick is documented honestly as no-effect / `準備中`.
- One attack still hits only once.
- records/settings schema remain unchanged.

#### 3) What should remain unchanged for now

- Amp reach remains +24px for now.
- Case normal damage reduction remains 20% for now.
- Drum Sticks critical rate remains 35% for now.
- Drum Sticks critical multiplier remains 1.5x for now.
- Pick remains no-effect for now.
- No new records/analytics are added yet.
- No large UI rewrite should happen in one PR.

#### 4) Risks / watch points

- Amp reach could feel too subtle or too safe depending on playtest outcomes.
- Case could become too generally useful if defensive value dominates.
- Drum Sticks critical may still feel streaky due to randomness.
- Drum Sticks + Case tradeoff may be unclear without explicit UI explanation.
- Pick may confuse players if selectable while no-effect.
- Mixed English/Japanese UI wording may reduce clarity.
- Manual playtesting is still needed before larger mechanic expansion.

#### 5) Recommended next-phase direction

Phase 11 should prioritize UI clarity and playtest-readiness before new mechanics:

- Start with centralized display-label helpers/maps.
- Apply Japanese labels to low-risk UI surfaces:
  - Equipment Select visible equipment names
  - Battle HUD equipment labels
  - ResultScene equipment labels
- Show Pick as `ピック（準備中）` or `ピック` + `準備中` in Equipment Select.
- Keep Battle HUD compact.
- Do not add Pick gameplay yet.
- Do not add new equipment mechanics until the current prototype is easier to understand and test.

#### 6) Explicit no-go items for now

- No projectile Amp.
- No Amp echo hitbox.
- No multi-hit equipment behavior.
- No guard / just guard.
- No HP-boosting Case.
- No knockback-reducing Case.
- No Pick gameplay effect yet.
- No special moves.
- No combo system.
- No equipment-specific win-rate analytics.
- No damage dealt records.
- No critical count records.
- No records/settings schema changes.
- No assets/audio/images/3D/font additions.

#### 7) Suggested next tasks (proposed, not implemented here)

- Phase 11-1: Centralized Japanese display-label helpers/maps.
- Phase 11-2: Equipment Select Japanese label runtime update.
- Phase 11-3: Battle/Result equipment label Japanese runtime update.
- Phase 11-4: Pick `準備中` UI wording runtime update.
- Phase 11-5: UI wording playtest checklist.
- Phase 11-6: Manual playtest notes / tuning candidates.

### Phase 10 Japanese UI implementation addendum

This section is a Phase 10 addendum that extends the prototype track with Japanese UI clarity work.
It does not replace prior Phase 10 design/prototype docs, and does not add gameplay systems.

#### Addendum scope and constraints

- Phase 10 is extended to finish Japanese UI clarity work before moving to Phase 11.
- This is an addendum after the Phase 10 prototype checkpoint.
- Goal: improve player-facing clarity, not add new mechanics.
- Internal IDs/types/storage keys remain English.
- Player-facing labels should move toward Japanese.
- `P1` / `P2` / `HP` / `CPU` / `Enter` / `Space` may remain English when compact/readable.
- No gameplay values change during Japanese UI PRs.
- No assets/audio/images/3D/font additions.
- No records/settings schema changes.

#### Critical wording decision (user override)

- Final runtime critical label target: `クリティカル！`
- `会心！` should **not** be used as the final runtime label.
- Existing docs that still reference `会心！` should be updated through this addendum sequence for consistency.
- This addendum PR itself is docs-only; no runtime wording switch is performed here.

#### Japanese label baseline (target display text)

Equipment:

- `none` / No Accessory -> `装備なし`
  - short: `なし`
  - description: `追加装備なし。素の性能で戦う。`
- `amp` / Amp -> `アンプ`
  - short: `アンプ`
  - description: `エレキギター・ベース・キーボード対応。攻撃の届く範囲が少し伸びる。`
- `pick` / Pick -> `ピック（準備中）`
  - short: `ピック`
  - description: `Phase 10では効果なし。後のフェーズで検討。`
- `case` / Case -> `ケース`
  - short: `ケース`
  - description: `通常ダメージを軽減する。クリティカルは軽減できない。`

Fighters:

- `electric-guitar` / Electric Guitar -> `エレキギター`
- `bass` / Bass -> `ベース`
- `drum-sticks` / Drum Sticks -> `ドラムスティック`
  - description direction: `高クリティカルキャラ。ケース装備時は高クリティカルを失う。`
- `keyboard` / Keyboard -> `キーボード`

#### Screen wording priorities

- Equipment Select (**highest priority**):
  - `Equipment Select` -> `装備選択`
  - `P1 Equipment` -> `P1装備`
  - `P2 Equipment` -> `P2装備`
  - `Continue` -> `決定`
- Battle HUD (**highest priority**):
  - `P1 Equip` -> `P1装備`
  - `P2 Equip` -> `P2装備`
  - Equipment short labels should be Japanese.
- ResultScene:
  - `Match Result` -> `試合結果`
  - `Match finished` -> `試合終了`
  - rematch -> `再戦`
  - return Home -> `ホームへ戻る`
- Character Select:
  - `Character Select` -> `キャラ選択`
  - `Fighter` -> `キャラ`
  - `Speed` -> `移動速度`
  - `Damage` -> `攻撃力`
  - `Knockback` -> `ふっとばし`
- Home:
  - `Start` -> `はじめる`
  - `Records` -> `記録`
  - `Options` -> `設定`
  - confirm -> `決定`
- Mode Select:
  - `VS HUMAN` -> `ふたりで対戦`
  - `VS CPU` -> `CPU戦`
  - `Choose your match mode` -> `対戦モードを選択`
- Options:
  - `Options` -> `設定`
  - `Effects` -> `演出`
  - `Screen Shake` -> `画面揺れ`
  - `Reset Preferences` -> `設定リセット`
- Records:
  - `Records` -> `記録`
  - `Total Matches` -> `試合数`
  - `Wins` -> `勝利`
  - `Draws` -> `引き分け`
  - `Reset Records` -> `記録リセット`
- Pause / Quick Help:
  - `Paused / Quick Help` -> `一時停止 / 操作確認`
  - Keep it short; do not turn it into a long tutorial.

#### Implementation approach (for upcoming runtime UI PRs)

- Prefer centralized display-label helpers/maps.
- Do not scatter hardcoded Japanese strings across scenes.
- Suggested helpers/maps:
  - `fighterDisplayNameJaById`
  - `equipmentDisplayTextById`
  - `getFighterDisplayNameJa(...)`
  - `getEquipmentDisplayTextJa(...)`
  - `getPlayer2ModeLabelJa(...)`
- Alternative acceptable approach: add `displayNameJa`, `shortLabelJa`, `descriptionJa` fields to definitions if safer.
- Scene data/storage/records values must remain English IDs.

#### Phase 10 Japanese UI addendum task sequence (proposed)

- Phase 10-JP-1: Japanese UI addendum scope docs.
- Phase 10-JP-2: Centralized Japanese display-label helpers/maps.
- Phase 10-JP-3: Equipment Select Japanese label runtime update.
- Phase 10-JP-4: Battle HUD Japanese equipment labels.
- Phase 10-JP-5: ResultScene Japanese labels.
- Phase 10-JP-6: Character Select Japanese labels.
- Phase 10-JP-7: Home / Mode Select / Options / Records low-risk Japanese labels.
- Phase 10-JP-8: Pause / Quick Help Japanese labels.
- Phase 10-JP-9: Pick準備中 / Amp非対応 / Case軽減 / Drum Sticksクリティカル explanation consistency check.
- Phase 10-JP-10: Japanese UI playtest checklist.
- Phase 10-JP-11: Japanese UI checkpoint docs.

#### Phase 10-JP-2 implemented note

- Centralized Japanese display-label helpers/maps are added in runtime infrastructure.
- Equipment/fighter Japanese labels are now centralized for safer reuse in later UI tasks.
- Critical label target is centralized as `クリティカル！`.
- Broad screen-by-screen Japanese UI conversion is still pending for follow-up tasks.
- No gameplay/balance/schema changes were introduced in this step.

#### Phase 10-JP-3 implemented note

- Equipment Select visible UI labels are updated to Japanese.
- Equipment Select now uses centralized Japanese equipment/fighter label helpers.
- Pick is shown as no-effect / `準備中` in the Equipment Select description.
- No gameplay/balance/schema changes were introduced in this step.

#### Phase 10-JP-4 implemented note

- Battle HUD equipment labels are updated to Japanese (`P1装備` / `P2装備`).
- Battle HUD equipment short labels now use the centralized Japanese short-label helper.
- Broader Battle text translation is still pending for follow-up tasks.
- No gameplay/balance/schema changes were introduced in this step.

#### Phase 10-JP-5 implemented note

- ResultScene labels are updated to Japanese.
- ResultScene now uses centralized Japanese fighter/equipment label helpers.
- Result title / rematch / home-return related visible text is Japanese.
- No gameplay/balance/schema changes were introduced in this step.


### Phase 9-3 Equipment concept (docs only)

Role of equipment (for):

- lightweight optional support identity per player (0 or 1)
- flavor readability and future shell/UI language
- match-local concept for simple local battles

Non-role of equipment (not for in this step):

- no stat buffs (damage/range/defense/critical/speed)
- no new combat systems (guard/just guard/specials/rounds/timer/retire)
- no progression/meta systems (unlocks/rarity/crafting/loot/currency/shop/account/server)
- no records analytics extension for equipment

Initial concept candidates:

- `none` / No Accessory: baseline default, fully playable/readable, comparison point.
- `amp` / Amp: louder stage/sound projection flavor; may later connect to sonic/sound/hybrid language; not a ranged/projectile/reach/damage buff at this stage.
- `pick` / Pick: sharper/precise flavor; may later connect to technical/sharper wording; not critical/damage/speed buffs at this stage.
- `case` / Case: sturdy/protective stage gear flavor; may later connect to sturdy/protective language; not defense/shield/guard behavior at this stage.

Implementation boundary:

- this is concept-only docs work
- no runtime/schema changes (no registry, scene, handoff, persistence, HUD/result labels, or effect implementation)
- `attackMethod` / `impactClass` remain planning language unless a later explicit runtime task implements them

Next recommended task: **Phase 9-13: Result equipment display**.


### Phase 9-4 Equipment data model (docs only)

Planned TypeScript-style model (documentation only):

```ts
type EquipmentId = 'none' | 'amp' | 'pick' | 'case';

type EquipmentDefinition = {
  id: EquipmentId;
  displayName: string;
  shortLabel: string;
  description: string;
  conceptRole: string;
};
```

Field intent:

- `id`: stable equipment identity used for future registry/handoff/persistence
- `displayName`: full readable name for menus/details
- `shortLabel`: compact text for future HUD/Result display
- `description`: short flavor summary
- `conceptRole`: design-language tag for readability (not runtime power)

Planned candidate metadata:

- `none`: `No Accessory` / `None` / default baseline no-support-equipment role
- `amp`: sound projection/stage presence flavor
- `pick`: sharper/precise playing flavor
- `case`: sturdy/protective stage gear flavor

Safety/fallback rules:

- equipment remains 0 or 1 support item per player
- `none` is safe default/fallback
- invalid/missing equipment IDs should later resolve to `none`
- same equipment for both players is allowed

Intentional exclusions (why):

- combat/stat fields are excluded to prevent hidden buffs in this stage
- excluded examples: damage/range/defense/speed/cooldown/duration/hitbox/knockback/critical/guard/shield/projectile/special behavior
- progression/economy/account fields are excluded (rarity/unlock/price/currency/inventory/owner data)
- records/settings schema fields are unchanged

Implementation boundary:

- docs-only in this step
- no runtime type/schema added to `src/main.ts`
- Phase 9-5 is the first runtime step (equipment registry)

Next recommended task: **Phase 9-13: Result equipment display**.


### Phase 9-6 EquipmentSelectScene design (docs only)

Purpose:

- design a small menu scene between Character Select and Battle
- prepare equipment selection UX before runtime shell implementation

Future flow target (not implemented in this step):

- Home -> Mode Select -> Character Select -> Equipment Select -> Battle -> Result

Scene goals:

- show chosen P1/P2 fighter context
- show P1/P2 equipment choice rows
- support choices from `none`, `amp`, `pick`, `case`
- default/fallback both players to `none`
- allow same equipment on both players
- keep equipment optional and identity/readability-focused

Control plan (future):

- Left/Right changes equipment on focused row
- Up/Down switches focus between P1 and P2 rows
- Enter/Space confirms and continues to Battle
- Esc returns to Character Select
- optional future: `R` resets choices to `none`

Visual plan (future):

- title `Equipment Select`
- P1 row and P2 row
- display `displayName`, `shortLabel`, and short description
- include a compact guardrail note such as `Equipment is flavor-only for now`
- continue rectangle/text style (no asset requirement)

Data/handoff direction (future, not implemented):

- scene may receive: `player1FighterId`, `player2FighterId`, `player2Mode`
- scene may later pass: `player1FighterId`, `player2FighterId`, `player2Mode`, `player1EquipmentId`, `player2EquipmentId`
- invalid/missing equipment IDs should resolve to `none` via `getEquipmentDefinition`

Boundaries:

- no runtime scene code in this task
- no equipment buff/stat/system behavior
- no persistence/records analytics/account/progression design expansion in this task

Next recommended task: **Phase 9-13: Result equipment display**.
