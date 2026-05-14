# Character Planning

## Current roster status

The game currently has three implemented fighters in the fighter registry:

| Fighter | Status | Notes |
| --- | --- | --- |
| Electric Guitar | Implemented | Faster standard fighter with a sharper horizontal attack hitbox. |
| Bass | Implemented | Slower heavier fighter with a taller/heavier attack hitbox. |
| Drum Sticks | Implemented | Lightweight fast fighter with short reach. |

## Phase 3 core band target

Phase 3 is the core band 4 fighters phase.

1. Electric Guitar — already implemented.
2. Bass — already implemented.
3. Drum Sticks — implemented in Phase 3-2.
4. Keyboard — add after Drum Sticks and any minimal body-shape preparation if needed.

## Phase 3 fighter notes

### Drum Sticks

- Implemented in Phase 3-2.
- Starting stats: HP 80, move speed 310, damage 8, knockback speed 420.
- Attack shape: width 64, height 44, Y offset -4.
- Feels lightweight, fast, pokey, and fragile.
- Does not introduce multi-hit.
- One attack must still hit only once.
- Uses the existing fighter registry and CharacterSelectScene.

### Keyboard

- Add after Drum Sticks.
- Do minimal body-shape preparation first if needed.
- Keep it simple: no special systems, no projectiles, and no complex combos for the first implementation.

## Balance philosophy

Instrument Brawl should not over-normalize fighters. The goal is funny, readable, replayable imbalance with clear strengths and weaknesses, not tournament-level fairness.

A fighter can be odd or lopsided if players can quickly understand what makes that fighter strong, weak, and funny.

## Later candidate ideas

These are later candidate ideas only and should not be treated as near-term Phase 3 fighters:

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
- Duplicate-pick prevention.
- Detailed balance analysis UI.
