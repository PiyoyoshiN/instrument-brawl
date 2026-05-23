# instrument-brawl

楽器同士が殴り合う1vs1物理格闘ゲームです。

ソーセージレジェンズに近い、ネタ寄りの物理バトルを目指します。
現在は Electric Guitar、Bass、Drum Sticks、Keyboard から選べる、シンプルなローカル1v1プロトタイプです。

## Current status

- Browser-playable Phaser + Vite + TypeScript game.
- Local 1v1 battle with Home -> Mode Select -> Character Select -> Battle -> Result scene flow.

Current scene flow: `Home -> Mode Select -> Character Select -> Battle -> Result` (+ `Home -> Options -> Home`).

Phase 7 checkpoint flow: `Home -> Mode Select -> Character Select -> Battle -> Result` (+ `Home -> Options -> Home`).

Mode Select behavior:

- Two vertically stacked large choices are shown: VS HUMAN (Local 2P) and VS CPU (P1 vs CPU).
- Local 2P maps to `player2Mode: "human"`.
- P1 vs CPU maps to `player2Mode: "cpu"`.
- Home Start now goes Home -> Mode Select -> Character Select.
- CharacterSelectScene uses the fighter registry and currently offers Electric Guitar, Bass, Drum Sticks, and Keyboard.
- P2 defaults to Human for local 2-player, with an optional simple CPU mode available from Character Select.
- Movement, attacks, HP, damage, velocity-based knockback, hit flash, win/draw detection, Ready/Fight start prompt, rematch, and return-to-character-select flow are implemented.
- Attack hit detection stays active during the visible attack duration, but one attack can hit only once.
- Phase 2.5 and Phase 3 are complete; the core band 4 fighters are implemented.

## Controls

### Home

- Left / Right: choose Start / Options
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
- Records runtime implementation is not implemented yet (no RecordsScene/Home Records entry/match result storage yet).
- Reset preferences is not implemented yet.

## Phase 8 scope: Records / Reset / Match Rule & Equipment Planning

Phase 8 is **not** a major combat expansion phase.

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
- Home Records entry remains future scope.

**Next recommended task:** Phase 8-9: Home Records entry.

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
