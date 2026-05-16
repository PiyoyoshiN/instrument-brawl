# Roadmap

## Current status

Instrument Brawl is currently a simple browser-playable local 1v1 prototype built with Phaser, Vite, and TypeScript.

- Current selectable fighters: Electric Guitar, Bass, Drum Sticks, and Keyboard.
- CharacterSelectScene lets both players choose from the fighter registry.
- P1 controls: A / D move, W / Space attack.
- P2 controls: Left / Right move, Up / Enter attack.
- R starts a rematch from the result screen.
- C returns from ResultScene to CharacterSelectScene with selected fighter IDs preserved.
- HP bars, clearer HP text, hit flash, visible-duration attack hit detection, one-hit-per-attack behavior, velocity-based knockback, win detection, draw detection, Home -> CharacterSelect -> Battle -> Result scene flow, clearer result screen, scene cleanup safeguards, final Phase 2 balance tuning, fighter registry, scene-data fighter ID handoff, minimal character select, and character select readability/stat display polish are implemented.

## Completed

### Phase 1: playable prototype — complete

Goal: make the smallest fun version of the game.

- Create a browser-playable local 1v1 match.
- Add one arena.
- Add Electric Guitar and Bass as fixed starter fighters.
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

Current implemented fighter tuning:

| Fighter | HP | Move speed | Damage | Knockback speed | Attack style |
| --- | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | 100 | 260 | 10 | 520 | Faster standard fighter with a sharper horizontal attack hitbox |
| Bass | 105 | 230 | 10 | 580 | Slower heavier fighter with a taller/heavier attack hitbox |
| Drum Sticks | 80 | 310 | 8 | 420 | Lightweight fast fighter with short reach |
| Keyboard | 95 | 215 | 9 | 500 | Wide awkward area-control fighter with a broad body and long reach |

### Phase 2.5: future expansion preparation — complete

Goal: prepare the project for future expansion without adding new gameplay content yet.

Completed steps:

- Phase 2.5-1: Fighter definitions are organized for safer future character expansion.
- Phase 2.5-2a: BattleScene shows a short Ready/Fight prompt before movement and attacks begin.
- Phase 2.5-2b: Simple fighter registry is implemented for future expansion.
- Phase 2.5-3: BattleScene can receive P1/P2 fighter IDs through scene data.
- Phase 2.5-4: A minimal CharacterSelectScene is implemented using the fighter registry and initially exposed Electric Guitar and Bass.
- Phase 2.5-5: ResultScene can return to CharacterSelectScene with selected fighter IDs preserved.
- Phase 2.5-6: CharacterSelectScene readability is improved with clearer selected fighter labels and lightweight HP, Speed, Damage, and Knockback stat display.

## Phase 3: core band 4 fighters — complete

Goal: expand the selectable roster to the core band set while keeping each fighter simple, funny, and readable. This goal is complete.

Core band fighters:

1. Electric Guitar — already implemented.
2. Bass — already implemented.
3. Drum Sticks — implemented in Phase 3-2.
4. Keyboard — implemented in Phase 3-6 with a wider 112 x 70 body and area-control reach.

Completed steps:

- Phase 3-2: Drum Sticks is implemented as a lightweight fast fighter with short reach, low HP, lower damage, and lower knockback.
- Phase 3-3: CharacterSelectScene is polished for the current three-fighter roster with clearer fighter count and selected index display.
- Phase 3-4: Drum Sticks receives a light balance sanity pass; stats remain unchanged pending more playtest feedback.
- Phase 3-5: Optional per-fighter body dimensions are prepared for future fighters like Keyboard while existing fighters keep the default 72 x 120 body.
- Phase 3-6: Keyboard is implemented as the fourth core band fighter with wide body dimensions, awkward slower movement, and a broad one-hit attack.
- Phase 3-7: The four-fighter roster receives a light sanity pass; current values are kept because the fighters remain readable, distinct, and playable.
- Phase 3-8: Phase 3 completion is documented and future work is directed toward Phase 4 presentation/polish.

Phase 3 completion summary:

- Fighter registry, CharacterSelectScene, BattleScene scene-data handoff, ResultScene rematch, and ResultScene return-to-character-select support all four core fighters.
- Phase 3 kept one attack per fighter, one attack hitting only once, simple rectangle prototype visuals, local 1v1 only, and same-character selection allowed.
- Phase 3 intentionally avoided CPU, BGM/SE, story, encyclopedia, progression, specials, items, timer, rounds, retire button, and new non-core fighters.

Later candidate ideas only, not Phase 3 fighters:

- Microphone.
- Piano.
- Bongo.
- Tambourine.

## Phase 4: solo play preparation, presentation, and audio-ready planning

Goal: make the completed core loop easier to play alone, clearer to read, and ready for later presentation/audio work without adding audio assets yet.

Phase 4 is not only visual polish. It includes solo play preparation, presentation/polish, and audio-ready structure planning.

Early Phase 4 priorities:

- Phase 4-1: Define Phase 4 scope and guardrails.
- Phase 4-2: Design minimal P1 vs CPU mode before implementation.
- Phase 4-3: Implement minimal P2 CPU mode for solo play while preserving local 2-player as the default.
- Phase 4-4: CPU sanity pass keeps local 2-player unchanged and lightly tunes CPU comfort distance so short-reach CPU fighters do not stop just outside attack range.
- Phase 4-7: Light menu visual polish improves Home, Character Select, and Result readability without changing controls or scene flow.
- Phase 4-8: Light arena visual polish improves BattleScene floor separation, background lines, and fighter grounding while keeping rectangle visuals.
- CharacterSelectScene defaults to P2 Human mode and allows choosing P2 Human or CPU.
- Match scene data preserves `player2Mode` (`human` or `cpu`) from CharacterSelectScene to BattleScene to ResultScene.
- ResultScene R rematch and C return-to-character-select preserve selected fighters and P2 Human/CPU mode.
- The first CPU stays simple: control P2 only, wait for Ready/Fight, stop after matchOver, approach P1 when far away, attack when close enough, and optionally back away sometimes.
- CPU uses existing fighter stats and existing attack cooldown, attack duration, one-hit-per-attack rule, HP, hit flash, knockback, win/draw detection, and ResultScene flow.
- Do not add difficulty settings, learning AI, strong prediction, perfect avoidance, or CPU-only stat changes yet.
- Improve menus, arena readability, hit/win/restart feedback, and comedic presentation details in small focused PRs.

Audio guardrails:

- Phase 4-6: Document audio policy without adding audio assets.
- Do not add BGM/SE audio files yet.
- Later Phase 4 work may prepare an audio-ready structure such as `public/assets/audio/bgm` and `public/assets/audio/sfx`.
- Future audio sources must be safe for a public GitHub repository, such as self-made audio, CC0 assets, or properly credited licensed assets such as CC-BY when credits are handled.
- Do not commit commercial songs, existing game BGM, YouTube audio, unclear-license files, or ear-copy recreations of copyrighted tracks.
- Future lightweight audio settings may include `soundEnabled` and `masterVolume`, but do not build a full settings screen yet.

Early Phase 4 non-goals:

- New fighters.
- Specials, items, progression, story, encyclopedia, timer, rounds, or retire button.
- Over-normalizing fighter differences.
- Large mixed-scope PRs; keep 1 PR = 1 feature.

## Features to avoid for now

- Online multiplayer.
- Complex combos.
- Competitive ranking.
- Large move lists.
- Campaign or story mode.
- Unlock systems.
- Deep customization.
- CPU behavior beyond the minimal early Phase 4 P2 CPU.
- BGM/SE audio files.
- Story or encyclopedia features.
- Progression systems.
- Specials or items.
- Timer or rounds.
- Retire button.
- More fighters before Phase 4 solo play preparation and presentation/polish improve the completed core band roster.
