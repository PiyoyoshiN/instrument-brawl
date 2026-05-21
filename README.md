# instrument-brawl

楽器同士が殴り合う1vs1物理格闘ゲームです。

ソーセージレジェンズに近い、ネタ寄りの物理バトルを目指します。
現在は Electric Guitar、Bass、Drum Sticks、Keyboard から選べる、シンプルなローカル1v1プロトタイプです。

## Current status

- Browser-playable Phaser + Vite + TypeScript game.
- Local 1v1 battle with Home -> Mode Select -> Character Select -> Battle -> Result scene flow.

Current scene flow: `Home -> Mode Select -> Character Select -> Battle -> Result` (+ `Home -> Options -> Home`).

Current and planned Phase 7 flow: `Home -> Mode Select -> Character Select -> Battle -> Result`, with a minimal Options shell from Home.

Mode Select behavior:

- Two button-style choices are shown at once: Local 2P and P1 vs CPU.
- Local 2P maps to `player2Mode: "human"`.
- P1 vs CPU maps to `player2Mode: "cpu"`.
- Home Start now goes Home -> Mode Select -> Character Select.
- CharacterSelectScene uses the fighter registry and currently offers Electric Guitar, Bass, Drum Sticks, and Keyboard.
- P2 defaults to Human for local 2-player, with an optional simple CPU mode available from Character Select.
- Movement, attacks, HP, damage, velocity-based knockback, hit flash, win/draw detection, Ready/Fight start prompt, rematch, and return-to-character-select flow are implemented.
- Attack hit detection stays active during the visible attack duration, but one attack can hit only once.
- Phase 2.5 and Phase 3 are complete; the core band 4 fighters are implemented.

## Controls

### Mode select

- Left / Right or Up / Down: choose mode (Local 2P / P1 vs CPU)
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


## Phase 7-7 localStorage save foundation (design only)

Phase 7-7 defined the localStorage contract, and Phase 7-8 adds safe utility helpers only. Confirmed selections are saved, and last selected mode/fighters are now restored into Mode Select and Character Select initial UI. ModeSelect scene data still overrides stored P2 mode when provided.

Planned save scope (future implementation):

- Last selected P1 fighter ID
- Last selected P2 fighter ID
- Last selected P2 mode
- Effects enabled flag
- Screen shake enabled flag

Suggested storage shape (single key + lightweight JSON):

- Key: `instrument-brawl:settings`
- Value: small JSON object with versioning for future migration

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

Planned behavior (future tasks):

- If localStorage is unavailable or JSON parsing fails, fall back to current defaults.
- Invalid fighter IDs are ignored and replaced by default fighter IDs.
- Invalid `player2Mode` falls back to `"human"`.
- Save occurs only after confirmed selections or option changes.
- Load occurs when entering ModeSelectScene / CharacterSelectScene.
- No server saving and no online/account sync.
- No Records data is stored yet (Records remains future planning scope).
- OptionsScene now allows toggling/saving `effectsEnabled` and `screenShakeEnabled` only.
- Preferences are persisted and restored in Options UI, but are not applied to BattleScene behavior yet.



## Phase 7-11 Options preferences scope (design only)

Phase 7-11 is docs-only planning. `OptionsScene` is still future implementation and is not part of this step.

Planned Options scope (future):

- Effects: ON/OFF -> `preferences.effectsEnabled`
- Screen Shake: ON/OFF -> `preferences.screenShakeEnabled`

Storage and defaults:

- Use existing local settings object key: `instrument-brawl:settings`
- Keep default preferences as:
  - `effectsEnabled: true`
  - `screenShakeEnabled: true`
- If localStorage is unavailable/invalid, continue with defaults.

Planned behavior notes (future tasks):

- Options changes should eventually save immediately or on confirm.
- Effects OFF should later disable only visual-only extras (e.g. hit spark, `CLEAN HIT` sub-label, win/draw accent effects, other nonessential presentation effects).
- Screen Shake OFF should later disable only tiny camera/screen shake.
- Screen Shake OFF should not disable other effects.
- Effects OFF must not alter gameplay values/logic (damage, knockback, hit detection, CPU behavior, one-hit-per-attack rule).
- BGM/SE settings are out of scope until audio playback/assets exist.
- Records data is out of scope for Options at this step.

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
