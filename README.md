# instrument-brawl

楽器同士が殴り合う1vs1物理格闘ゲームです。

ソーセージレジェンズに近い、ネタ寄りの物理バトルを目指します。
現在は Electric Guitar、Bass、Drum Sticks、Keyboard から選べる、シンプルなローカル1v1プロトタイプです。

## Current status

- Browser-playable Phaser + Vite + TypeScript game.
- Local 1v1 battle with Home -> Character Select -> Battle -> Result scene flow.
- CharacterSelectScene uses the fighter registry and currently offers Electric Guitar, Bass, Drum Sticks, and Keyboard.
- P2 defaults to Human for local 2-player, with an optional simple CPU mode available from Character Select.
- Movement, attacks, HP, damage, velocity-based knockback, hit flash, win/draw detection, Ready/Fight start prompt, rematch, and return-to-character-select flow are implemented.
- Attack hit detection stays active during the visible attack duration, but one attack can hit only once.
- Phase 2.5 and Phase 3 are complete; the core band 4 fighters are implemented.

## Controls

### Character select

- P1 A / D: choose fighter
- P2 Left / Right: choose fighter
- P2 Down: switch P2 Human / CPU
- Enter / Space: start battle
- Escape: return Home

### Battle

- P1 A / D: move
- P1 W / Space: attack
- P2 Left / Right: move when P2 mode is Human
- P2 Up / Enter: attack when P2 mode is Human

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

## Phase 4 direction

Phase 4 is solo play preparation + presentation/polish + audio-ready structure without audio assets. It is not only visual polish.

Phase 4-3 adds the minimal P2 CPU for solo play. The first CPU simply approaches P1, attacks when close enough, and can sometimes back away. CPU uses existing fighter stats and existing attack rules; no difficulty settings, learning AI, strong prediction, or CPU-only stat changes are added.

BGM/SE audio files should not be added yet. Later Phase 4 work may prepare an audio-ready structure and audio policy. Future audio sources must be safe for a public GitHub repository, such as self-made, CC0, or properly credited licensed assets. Do not commit commercial songs, existing game BGM, YouTube audio, unclear-license files, or ear-copy recreations of copyrighted tracks.

New fighters, specials, items, progression, story, encyclopedia, timer, rounds, and retire button are not the first Phase 4 tasks. Keep PRs focused: 1 PR = 1 feature.

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
