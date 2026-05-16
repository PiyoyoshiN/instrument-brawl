# Game Design

## Core concept

Instrument Brawl is a browser-based 1v1 physics fighting game where musical instruments fight each other.

The tone should be funny, loose, and chaotic. The goal is to feel closer to Sausage Legend than a serious competitive fighting game: simple inputs, floppy physics, exaggerated hits, and quick rematches.

## Current playable state

The game is currently a simple local 1v1 prototype built with Phaser, Vite, and TypeScript.

- CharacterSelectScene lets players choose from the current fighter registry.
- Current selectable fighters: Electric Guitar, Bass, Drum Sticks, and Keyboard.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R starts a rematch from the result screen.
- C returns from ResultScene to CharacterSelectScene with selected fighter IDs preserved.
- HP bars and clearer HP text are implemented.
- Hit flash is implemented.
- Velocity-based knockback is implemented.
- Visible-duration attack hit detection is implemented.
- One attack causes only one hit.
- HomeScene, CharacterSelectScene, BattleScene, and ResultScene provide the current match flow.
- BattleScene shows a short Ready/Fight prompt before fighters can move or attack.

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

### Character select

- P1 A / D: choose fighter.
- P2 Left / Right: choose fighter.
- Enter / Space: start battle.
- Escape: return Home.

### Player 1 battle controls

- A / D: move.
- W / Space: attack.

### Player 2 battle controls

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
- Starting a match should briefly pause on a clear Ready/Fight prompt so both players know when control begins.

## Balance philosophy

Instrument Brawl should not over-normalize fighters. The goal is funny, readable, replayable imbalance with clear strengths and weaknesses, not tournament-level fairness.

Balance changes should keep the game easy to understand and quick to rematch. A fighter can be weird, awkward, or lopsided if that personality is readable and funny.

## Core band fighters

Phase 3 core band fighter expansion is complete. The implemented roster is Electric Guitar, Bass, Drum Sticks, and Keyboard.

### Electric Guitar

- Already implemented.
- Faster standard fighter.
- HP: 100.
- Move speed: 260.
- Damage: 10.
- Knockback speed: 520.
- Uses a sharper horizontal attack hitbox.
- Should feel sharp, loud, and slightly wild.

### Bass

- Already implemented.
- Slower heavier fighter.
- HP: 105.
- Move speed: 230.
- Damage: 10.
- Knockback speed: 580.
- Uses a taller/heavier attack hitbox.
- Should feel weighty and funny when it swings around.

### Drum Sticks

- Implemented in Phase 3-2.
- Lightweight, fast, short-reach fighter.
- HP: 80.
- Move speed: 310.
- Damage: 8.
- Knockback speed: 420.
- Should feel quick, pokey, and fragile.
- Does not introduce multi-hit; one attack still hits only once.

### Keyboard

- Implemented in Phase 3-6.
- Wide, awkward, area-control fighter.
- HP: 95.
- Move speed: 215.
- Damage: 9.
- Knockback speed: 500.
- Body dimensions: 112 x 70.
- Attack shape: width 118, height 46, Y offset 0.
- Should feel physically annoying and reach-heavy without adding special systems.

## Phase 3 completion notes

Phase 3 stayed intentionally small: local 1v1 only, simple rectangle prototype visuals, one attack per fighter, one attack hitting only once, and same-character selection allowed. It avoided CPU, BGM/SE, story, encyclopedia, progression, specials, items, timer, rounds, retire button, and new non-core fighters.

The next planned direction is Phase 4 solo play preparation, presentation/polish, and audio-ready structure without audio assets, not more Phase 3 roster expansion.

## Phase 4 design direction

Phase 4 is not only visual polish. It should prepare solo play, improve presentation, and plan an audio-ready structure without committing audio assets yet.

### Minimal P1 vs CPU mode design

CharacterSelectScene keeps local 2-player mode as the default and includes a small P2 mode choice with two options: Human and CPU. P1 and P2 fighter selection continue to use the existing fighter registry, and same-character selection remains allowed for both Human and CPU modes.

Scene data carries the P2 mode alongside the existing fighter IDs:

- `player1FighterId`.
- `player2FighterId`.
- `player2Mode`, using a simple value such as `human` or `cpu`.

CharacterSelectScene passes `player2Mode` to BattleScene when starting a match. BattleScene passes the same value to ResultScene when the match ends. ResultScene rematch preserves the selected fighters and `player2Mode`; returning to CharacterSelectScene with C also preserves the selected fighters and `player2Mode`.

### Minimal CPU behavior

- Implemented in Phase 4-3.
- CPU controls P2 only.
- CPU does not act before the Ready/Fight start prompt enables the match.
- CPU does not act after `matchOver`.
- CPU moves toward P1 when far away.
- CPU attacks when close enough.
- CPU can optionally back away sometimes so it feels less robotic.
- CPU uses existing fighter stats.
- CPU uses the existing attack cooldown, attack duration, one-hit-per-attack rule, HP, hit flash, knockback, win/draw detection, and ResultScene flow.
- No difficulty settings, learning AI, strong prediction, perfect avoidance, or CPU-only stat changes are added yet.
- Phase 4-4 sanity pass keeps the CPU minimal and lightly reduces its comfort distance so short-reach fighters keep approaching until they can actually attack.

### Audio-ready planning

- Phase 4-6 defines the audio policy without adding audio assets.
- Do not add BGM/SE audio files yet.
- Later Phase 4 work may prepare audio structure such as `public/assets/audio/bgm` and `public/assets/audio/sfx`.
- Future audio sources must be safe for a public GitHub repository: self-made, CC0, or properly credited licensed assets such as CC-BY when credits are handled.
- Do not commit commercial songs, existing game BGM, YouTube audio, unclear-license files, or ear-copy recreations of copyrighted tracks.
- Lightweight audio settings such as `soundEnabled` and `masterVolume` may be planned later, but do not build a full settings screen yet.
- See `docs/audio-policy.md` for the repository audio policy.

### Early Phase 4 guardrails

- Keep the current implemented state consistent: four selectable fighters, local 1v1, simple rectangle prototype visuals, one attack hitting only once, and same-character selection allowed.
- Phase 4-7 lightly improves menu labels, helper text, and result readability while keeping scene flow and controls unchanged.
- Phase 4-8 lightly improves BattleScene arena readability with clearer floor/platform separation, subtle background guide lines, and simple rectangle grounding details.
- Phase 4-9 lightly improves hit and match-end readability with small text/rectangle feedback while preserving damage, HP, knockback, one-hit attacks, and ResultScene flow.
- New fighters, specials, items, progression, story, encyclopedia, timer, rounds, and retire button are not first Phase 4 tasks.
- Keep PRs focused: 1 PR = 1 feature.
- Keep the balance philosophy: do not over-normalize fighter differences.

## Phase 4 checkpoint notes

Phase 4 currently has local 2P as the default, optional P2 CPU mode, four selectable fighters, preserved P2 mode through BattleScene and ResultScene flows, minimal CPU behavior with a sanity pass, audio policy without assets, and light menu/arena/hit/result polish.

The game still intentionally avoids new fighters, specials, items, progression, story, encyclopedia, timer, rounds, retire button, BGM/SE audio files, settings screen, and online play.

Known minor follow-up: ResultScene subtitle wording may be adjusted later if needed.

Next recommended direction is either audio-ready structure without assets or controlled Phase 5 planning. Do not add new gameplay yet unless a focused task explicitly asks for it.

## Later candidate ideas

These are later ideas only, not Phase 3 fighters:

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
- Online multiplayer.
- Complex combo systems.
- Ranked or competitive systems.
- Advanced AI opponents.
- Large story mode.
- Unlocks or inventory.
- Final art, animation, or sound polish.
