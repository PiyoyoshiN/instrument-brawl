# Roadmap

## Current status

Instrument Brawl is currently a simple browser-playable local 1v1 prototype built with Phaser, Vite, and TypeScript.

- Matchup: P1 Electric Guitar vs P2 Bass.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R starts a rematch from the result screen.
- HP bars, clearer HP text, hit flash, visible-duration attack hit detection, one-hit-per-attack behavior, velocity-based knockback, win detection, draw detection, Home -> Battle -> Result scene flow, clearer result screen, scene cleanup safeguards, final Phase 2 balance tuning, and organized fighter definitions are implemented.

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

Current fighter tuning:

| Fighter | HP | Move speed | Damage | Knockback speed | Attack style |
| --- | ---: | ---: | ---: | ---: | --- |
| P1 Electric Guitar | 100 | 260 | 10 | 520 | Faster standard fighter with a sharper horizontal attack hitbox |
| P2 Bass | 105 | 230 | 10 | 580 | Slower heavier fighter with a taller/heavier attack hitbox |

## Phase 2.5: future expansion preparation — in progress

Goal: prepare the project for future expansion without adding new gameplay content yet.

Completed steps:

- Phase 2.5-1: Fighter definitions are organized for safer future character expansion.

Potential next steps:

- Refine match start, match end, and rematch flow.
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
