# instrument-brawl

楽器同士が殴り合う1vs1物理格闘ゲームです。

ソーセージレジェンズに近い、ネタ寄りの物理バトルを目指します。
現在はギターとベースだけで戦う、シンプルなローカル1v1プロトタイプです。

## Current status

- Browser-playable Phaser + Vite + TypeScript game.
- Local 1v1 battle: P1 Electric Guitar vs P2 Bass.
- Movement, attacks, HP, damage, velocity-based knockback, hit flash, win/draw detection, and a simple Home -> Battle -> Result scene flow are implemented.
- Attack hit detection stays active during the visible attack duration, but one attack can hit only once.
- Simple HP bars and clearer HP text are implemented.

## Controls

### Player 1: Electric Guitar

- A / D: move
- W / Space: attack

### Player 2: Bass

- Left / Right: move
- Up / Enter: attack

### Match

- R: rematch from the result screen

## Current fighters

| Fighter | HP | Move speed | Damage | Knockback speed | Attack style |
| --- | ---: | ---: | ---: | ---: | --- |
| P1 Electric Guitar | 100 | 260 | 10 | 520 | Faster standard fighter with a sharper horizontal attack hitbox |
| P2 Bass | 105 | 230 | 10 | 580 | Slower heavier fighter with a taller/heavier attack hitbox |

## Next up

The next major direction is refining the basic scene flow and match-end presentation. Character select should wait until the flow is stable.

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
