# Game Design

## Core concept

Instrument Brawl is a browser-based 1v1 physics fighting game where musical instruments fight each other.

The tone should be funny, loose, and chaotic. The goal is to feel closer to Sausage Legend than a serious competitive fighting game: simple inputs, floppy physics, exaggerated hits, and quick rematches.

## Current playable state

The game is currently a simple local 1v1 prototype built with Phaser, Vite, and TypeScript.

- Matchup: P1 Electric Guitar vs P2 Bass.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R starts a rematch from the result screen.
- HP bars and clearer HP text are implemented.
- Hit flash is implemented.
- Velocity-based knockback is implemented.
- Visible-duration attack hit detection is implemented.
- One attack causes only one hit.
- HomeScene, BattleScene, and ResultScene provide a simple match flow.

## Initial MVP

The first MVP focused on a single playable match with:

- Two fighters on one arena.
- Local 1v1 play on the same keyboard.
- Simple physics-driven movement.
- One basic attack per fighter.
- HP for each fighter.
- Knockback when attacks connect.
- A clear win/loss result when one fighter reaches 0 HP.
- Fast restart after a match ends.

This MVP is complete.

## Basic controls

Keep controls simple so the game is easy to test and tune.

### Player 1

- A / D: move.
- W / Space: attack.

### Player 2

- Left / Right: move.
- Up / Enter: attack.

Movement should be intentionally a little awkward and physics-based. Attacks should be easy to trigger, but the results can be silly and unpredictable.

## Battle rules

- Each match is 1v1.
- Both players start with full HP.
- An attack deals damage when the striking part of the instrument hits the opponent.
- One attack can hit only once.
- Hits should apply velocity-based knockback.
- Hits briefly flash the damaged fighter.
- The first player to reduce the opponent's HP to 0 wins.
- If both fighters reach 0 HP at nearly the same time, show a draw.
- Matches should be short and restart quickly.

## First playable characters

### Electric Guitar

- The first Player 1 character.
- Faster standard fighter.
- HP: 100.
- Move speed: 260.
- Damage: 10.
- Knockback speed: 520.
- Uses a sharper horizontal attack hitbox.
- Should feel sharp, loud, and slightly wild.

### Bass

- The first Player 2 character.
- Slower heavier fighter.
- HP: 105.
- Move speed: 230.
- Damage: 10.
- Knockback speed: 580.
- Uses a taller/heavier attack hitbox.
- Should feel weighty and funny when it swings around.

## Next design direction

The basic HomeScene / BattleScene / ResultScene flow is in place. The next design direction is refining match flow and readability without adding character select yet.

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
