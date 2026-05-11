# Roadmap

## Current status

Instrument Brawl is currently a simple browser-playable local 1v1 prototype built with Phaser, Vite, and TypeScript.

- Matchup: P1 Electric Guitar vs P2 Bass.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R restarts after match end.
- HP bars, clearer HP text, hit flash, visible-duration attack hit detection, one-hit-per-attack behavior, velocity-based knockback, win detection, draw detection, and restart flow are implemented.

## Completed

### Phase 1: playable prototype — complete

Goal: make the smallest fun version of the game.

- Create a browser-playable local 1v1 match.
- Add one arena.
- Add Electric Guitar and Bass as fixed fighters.
- Add simple movement for both players.
- Add one attack for each fighter.
- Add HP, damage, knockback, and win/loss detection.
- Add a quick restart flow.
- Add GitHub Pages deployment setup.

### Phase 2: better game feel — in progress

Goal: make the prototype funnier and more satisfying without making it complex.

Completed steps:

- Phase 2-1: Attack hit detection is active during the visible attack duration, while one attack still hits only once.
- Phase 2-2: Knockback uses simple velocity-based movement.
- Phase 2-3: Hit feedback flash is implemented.
- Phase 2-4: Electric Guitar and Bass have light stat differences.
- Phase 2-5: Guitar and Bass have different attack hitbox sizes/shapes.
- Phase 2-6: Simple HP bars and clearer HP text are implemented.

Current fighter tuning:

| Fighter | HP | Move speed | Damage | Knockback speed | Attack style |
| --- | ---: | ---: | ---: | ---: | --- |
| P1 Electric Guitar | 100 | 260 | 10 | 520 | Faster standard fighter with a sharper horizontal attack hitbox |
| P2 Bass | 110 | 230 | 10 | 600 | Slower heavier fighter with a taller/heavier attack hitbox |

## Next up: Phase 2.5 / Phase 3 preparation

The next major direction is preparing clearer scene and match flow. This has not been implemented yet.

Potential next steps:

- Add a simple HomeScene.
- Keep or refine BattleScene separation as needed.
- Add a simple ResultScene.
- Improve match start, match end, and rematch flow.
- Possibly add simple BGM/SE later.
- Still do not add character select until the flow is stable.

## Phase 3: character expansion

Goal: add variety after the core match is fun and the basic flow is stable.

- Add more instrument fighters one at a time.
- Give each new instrument a simple physical personality.
- Keep each character easy to understand.
- Revisit balance only enough to keep matches funny and playable.

## Phase 4: presentation and polish

Goal: make the game feel complete once the core loop works.

- Add improved menus.
- Add better arena visuals.
- Add music and stronger sound design.
- Add simple effects for hits, wins, and restarts.
- Add small comedic details that support the instrument battle theme.

## Features to avoid for now

- Online multiplayer.
- Character select.
- Complex combos.
- Competitive ranking.
- Large move lists.
- Campaign or story mode.
- Unlock systems.
- Deep customization.
- Too many characters before the first matchup is fun.
