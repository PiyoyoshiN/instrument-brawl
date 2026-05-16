# instrument-brawl

楽器同士が殴り合う1vs1物理格闘ゲームです。

ソーセージレジェンズに近い、ネタ寄りの物理バトルを目指します。
現在は Electric Guitar、Bass、Drum Sticks、Keyboard から選べる、シンプルなローカル1v1プロトタイプです。

## Current status

- Browser-playable Phaser + Vite + TypeScript game.
- Local 1v1 battle with Home -> Character Select -> Battle -> Result scene flow.
- CharacterSelectScene uses the fighter registry and currently offers Electric Guitar, Bass, Drum Sticks, and Keyboard.
- Movement, attacks, HP, damage, velocity-based knockback, hit flash, win/draw detection, Ready/Fight start prompt, rematch, and return-to-character-select flow are implemented.
- Attack hit detection stays active during the visible attack duration, but one attack can hit only once.
- Phase 2.5 and Phase 3 are complete; the core band 4 fighters are implemented.

## Controls

### Character select

- P1 A / D: choose fighter
- P2 Left / Right: choose fighter
- Enter / Space: start battle
- Escape: return Home

### Battle

- P1 A / D: move
- P1 W / Space: attack
- P2 Left / Right: move
- P2 Up / Enter: attack

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

Phase 3 kept the game simple: local 1v1 only, simple rectangle prototype visuals, one attack per fighter, one attack hitting only once, and same-character selection allowed. Next work should move to Phase 4 presentation and polish unless a task explicitly says otherwise.

Instrument Brawl should not over-normalize fighters. The goal is funny, readable, replayable imbalance with clear strengths and weaknesses, not tournament-level fairness.

Later candidate ideas, not Phase 3 tasks: Microphone, Piano, Bongo, and Tambourine.

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
