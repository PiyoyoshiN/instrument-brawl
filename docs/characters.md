# Character Planning

## Current roster status

The game currently has four implemented fighters in the fighter registry:

| Fighter | Status | Notes |
| --- | --- | --- |
| Electric Guitar | Implemented | Faster standard fighter with a sharper horizontal attack hitbox. |
| Bass | Implemented | Slower heavier fighter with a taller/heavier attack hitbox. |
| Drum Sticks | Implemented | Lightweight fast fighter with short reach. |
| Keyboard | Implemented | Wide, awkward area-control fighter with a broad body and long reach. |

## Phase 3 core band target

Phase 3 is complete. The core band 4 fighters are implemented:

1. Electric Guitar — already implemented.
2. Bass — already implemented.
3. Drum Sticks — implemented in Phase 3-2.
4. Keyboard — implemented in Phase 3-6.

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

- Implemented in Phase 3-6.
- Starting stats: HP 95, move speed 215, damage 9, knockback speed 500.
- Attack shape: width 118, height 46, Y offset 0.
- Body dimensions: width 112, height 70.
- Feels wide, awkward, and area-control oriented.
- Slower than Electric Guitar, less bursty than Bass, and more physically annoying than Drum Sticks.
- Keeps the simple one-hit attack rule with no specials, projectiles, or complex combos.

## Phase 3-3 select polish notes

- CharacterSelectScene shows the implemented fighters through the existing registry.
- P1 and P2 can cycle independently through Electric Guitar, Bass, Drum Sticks, and Keyboard.
- Same-character selection remains allowed.

## Phase 3-4 Drum Sticks sanity pass

- Drum Sticks keeps its initial Phase 3-2 stats after the light balance sanity pass.
- No clear stat change is justified yet without more playtest feedback.
- Keep the current identity: fast, fragile, short reach, lower damage, lower knockback, and one hit per attack.

## Phase 3-5 body dimension preparation

- Fighter definitions now support optional body width and body height values.
- Electric Guitar, Bass, and Drum Sticks use the default 72 x 120 body size, so their visuals and collisions remain unchanged.
- Keyboard uses its Phase 3-6 custom 112 x 70 body size.
- Movement bounds and attack hitbox placement now use the fighter's actual body width.

## Phase 3-7 four-fighter sanity pass

- Electric Guitar, Bass, Drum Sticks, and Keyboard keep their current values after the sanity pass.
- No clear code-visible issue justified changing stats yet.
- The roster remains intentionally distinct: Electric Guitar is the baseline, Bass is heavier, Drum Sticks is fast and fragile, and Keyboard is wide and awkward.

## Phase 3 completion note

Phase 3 completed the core roster while keeping the game simple: local 1v1 only, simple rectangle prototype visuals, one attack per fighter, one attack hitting only once, and same-character selection allowed. It intentionally avoided CPU, BGM/SE, story, encyclopedia, progression, specials, items, timer, rounds, retire button, and new non-core fighters.

Future roster ideas should wait until explicitly requested; the next broad direction is Phase 4 solo play preparation, presentation/polish, and audio-ready structure without audio assets.

## Balance philosophy

Instrument Brawl should not over-normalize fighters. The goal is funny, readable, replayable imbalance with clear strengths and weaknesses, not tournament-level fairness.

A fighter can be odd or lopsided if players can quickly understand what makes that fighter strong, weak, and funny.

## Phase 4 roster checkpoint

The Phase 4 checkpoint roster remains Electric Guitar, Bass, Drum Sticks, and Keyboard. Keep same-character selection allowed, one attack hitting only once, and the existing fighter differences intact.

P2 can be Human or CPU, and any current fighter can be selected for either P2 mode. The minimal CPU uses existing fighter stats and attack rules rather than CPU-only stat changes.

Do not add new fighters until a controlled future phase explicitly asks for them.

## Later candidate ideas

These are later candidate ideas only and are not Phase 3 fighters:

- Microphone.
- Piano.
- Bongo.
- Tambourine.

## Avoided during Phase 3

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
