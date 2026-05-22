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

## Phase 8 next direction

- **Phase 8-2 should define the concrete Phase 8 scope.**
- Phase 8 should focus on:
  - Reset preferences
  - Records runtime
  - RecordsScene
  - Reset Records
  - docs planning for Retire / Timer / Equipment / Amp / `attackMethod`

Phase 8 should **not** immediately implement equipment systems, ranged attacks, critical damage/rate, guard/just-guard, rounds, timer gameplay expansion, new fighters, story, encyclopedia, online, server save, BGM/SE assets, sprites, or 3D.

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
