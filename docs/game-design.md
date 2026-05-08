# Game Design

## Core concept

Instrument Brawl is a browser-based 1v1 physics fighting game where musical instruments fight each other.

The tone should be funny, loose, and chaotic. The goal is to feel closer to Sausage Legend than a serious competitive fighting game: simple inputs, floppy physics, exaggerated hits, and quick rematches.

## Initial MVP

The first MVP should focus on a single playable match with:

- Two fighters on one arena.
- Local 1v1 play on the same keyboard.
- Simple physics-driven movement.
- One basic attack per fighter.
- HP for each fighter.
- Knockback when attacks connect.
- A clear win/loss result when one fighter reaches 0 HP.
- Fast restart after a match ends.

## Basic controls

Keep controls simple so the game is easy to test and tune.

### Player 1

- Move left.
- Move right.
- Attack.

### Player 2

- Move left.
- Move right.
- Attack.

Movement should be intentionally a little awkward and physics-based. Attacks should be easy to trigger, but the results can be silly and unpredictable.

## Battle rules

- Each match is 1v1.
- Both players start with full HP.
- An attack deals damage when the striking part of the instrument hits the opponent.
- Hits should apply knockback.
- The first player to reduce the opponent's HP to 0 wins.
- If both fighters reach 0 HP at nearly the same time, show a draw.
- Matches should be short and restart quickly.

## First playable characters

### Electric Guitar

- The first Player 1 character.
- Uses the guitar body and neck as a floppy striking shape.
- Should feel sharp, loud, and slightly wild.
- Basic attack: swing the guitar forward.

### Bass

- The first Player 2 character.
- Heavier and slightly slower than the Electric Guitar.
- Should feel weighty and funny when it swings around.
- Basic attack: swing the bass forward with more force but less speed.

## Things not to implement yet

- Online multiplayer.
- Character select.
- More than the initial Electric Guitar vs Bass matchup.
- Complex combo systems.
- Ranked or competitive systems.
- Advanced AI opponents.
- Large story mode.
- Progression, unlocks, or inventory.
- Final art, animation, or sound polish.
