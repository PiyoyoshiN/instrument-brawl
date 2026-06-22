# Phase 0-15 Progress Summary / Closeout

This document closes out the current project history from Phase 0 through Phase 15 as a checkpoint summary. It is docs-only and does not change runtime behavior, gameplay values, assets, audio, or storage schemas.

## Closeout judgment

Phase 0 through Phase 15 are treated as checkpoint-complete for the current v1.0 prototype track.

Current state:

- The game is a browser-playable local 1v1 Phaser / Vite / TypeScript prototype.
- The current playable roster is Electric Guitar, Bass, Drum Sticks, and Keyboard.
- The current scene flow includes Home, Mode Select, Character Select, Equipment Select, Battle, Result, Records, and Options.
- Core battle rules include movement, one attack per fighter, one-hit-per-attack behavior, HP, damage, knockback, Guard, Just Guard, Timer, Retire / Forfeit, Result reason display, equipment prototypes, records, settings, visual effects, backgrounds, and SE routing.
- Phase 14 is checkpoint complete as a visual-readability checkpoint and is visually frozen for now.
- Phase 15 is checkpoint complete as an SE implementation checkpoint.

## Phase 0 / initial concept

Phase 0 is treated as the project seed and concept framing stage.

Completed intent:

- Define Instrument Brawl as a joke-forward 1v1 browser fighting game where musical instruments fight each other.
- Keep the initial product small enough to become playable quickly.
- Favor readable, funny local play over competitive balance, online infrastructure, or large content scope.
- Use Phaser, Vite, and TypeScript as the browser-game foundation.

## Phase 1-4 early project foundation

Phase 1-4 are not omitted from the project history. They are the early concept, playable prototype, roster foundation, solo-play preparation, presentation, and planning phases that made later checkpoints possible.

### Phase 1: playable prototype

Main completed scope:

- Smallest browser-playable local 1v1 match.
- One arena.
- Electric Guitar and Bass as fixed starter fighters.
- Simple two-player movement and one attack per fighter.
- HP, damage, knockback, win/loss detection, and quick restart flow.
- GitHub Pages deployment setup.

### Phase 2: better game feel

Main completed scope:

- Attack hit detection active during visible attack duration.
- One attack still hits only once.
- Velocity-based knockback.
- Hit feedback flash.
- Electric Guitar / Bass stat and hitbox differences.
- HP bars and clearer HP text.
- Basic Home -> Battle -> Result flow.
- Result readability and cleanup safeguards.
- Final Phase 2 balance tuning for Guitar / Bass.

### Phase 2.5: future expansion preparation

Main completed scope:

- Safer fighter definition organization.
- Ready / Fight prompt.
- Fighter registry.
- BattleScene scene-data fighter ID handoff.
- Minimal Character Select.
- Result -> Character Select return with selected fighter IDs preserved.
- Character Select readability and stat display polish.

### Phase 3: core band 4 fighters

Main completed scope:

- Core roster expanded to four fighters:
  - Electric Guitar.
  - Bass.
  - Drum Sticks.
  - Keyboard.
- Character Select and scene handoff support the full roster.
- Keyboard body dimensions and area-control identity were added.
- Four-fighter sanity pass kept fighters readable, distinct, and playable.

### Phase 4: solo play preparation, presentation, and audio-ready planning

Main completed scope:

- Minimal P1 vs CPU mode.
- Local 2P preserved as the default.
- P2 Human / CPU mode preserved through Battle, Result, rematch, and return-to-character-select.
- Simple CPU approach / attack / occasional retreat behavior.
- Audio policy documented without adding BGM or SE assets.
- Light menu, arena, hit, and result presentation polish.
- Phase 4 checkpoint established that the core loop could support later foundation work.

## Phase 5-15 implementation and checkpoint summary

### Phase 5: foundation cleanup and roadmap alignment

Main completed scope:

- Roadmap alignment and foundation cleanup.
- Result subtitle polish.
- Compact in-battle Pause / Quick Help overlay with `P`.
- Manual playtest checklist.
- Audio-ready folder structure without adding BGM / SE playback.

### Phase 6: effects trial / presentation experiments

Main completed scope:

- Attack visual color variation.
- Primitive hit spark.
- `HIT -damage` marker and clean-hit sub-label.
- Tiny camera shake on confirmed hit.
- Small win/draw primitive effect.
- Visual-only experiment checkpoint; gameplay values remained unchanged.

### Phase 7: game shell and local save foundation

Main completed scope:

- Home -> Mode Select -> Character Select -> Battle -> Result shell.
- Options and Records shell direction.
- localStorage settings for last selected fighters / mode and preferences.
- Effects ON/OFF and Screen Shake ON/OFF preferences.
- Records foundation and reset behavior.
- Reset Preferences.

### Phase 8: records, reset, match rule and equipment planning

Main completed scope:

- Records / reset support reached runtime checkpoint status.
- Match rule planning for Retire / Forfeit and Timer.
- Equipment / Amp / attack identity planning.
- Critical / Guard / Just Guard remained design topics at this phase.
- Phase 8 did not implement equipment gameplay, new fighters, online, BGM/SE, images, or 3D.

### Phase 9: equipment shell and attack identity foundation

Main completed scope:

- Equipment concept shell and UI flow groundwork.
- Equipment Select flow and Result equipment display direction.
- Amp visual-only accent trial.
- Future equipment effect documentation.
- Attack identity planning hooks such as attack method / impact class remained future-facing.

### Phase 10: equipment prototype and Japanese UI addendum

Main completed scope:

- Equipment prototype work for Amp, Pick, and Case.
- Compatibility and battle-side safety rules.
- Damage pipeline preparation and equipment interaction documentation.
- Pick / Case / Amp behavior prototype work.
- Japanese UI label passes across major screens.
- Phase 10-JP checkpoint for Japanese UI consistency.

### Phase 11: UI layout rework

Main completed scope:

- Japanese UI layout/readability fixes.
- Viewport-aware layout foundation.
- Focused layout passes for Records, Character Select, Battle HUD/instructions, Pause / Quick Help, Equipment Select, Result, Options, Home, and Mode Select.
- Important regression notes for Character Select clipping and Battle HUD visibility.

### Phase 12: Guard / Just Guard / Timer / Retire / Match Rules

Main completed scope:

- Guard input and guard state.
- Normal Guard damage / knockback reduction and movement slowdown.
- Just Guard timing window and successful block behavior.
- 99-second timer and Time Up outcomes.
- Result reason handoff/display for KO / TIME UP / RETIRE / DRAW.
- Pause menu Retire / Forfeit confirmation flow.
- Records/settings schema sanity check.
- Checkpoint documented in `docs/phase-12-checkpoint-report.md`.

### Phase 13: Attack Tempo / Hitbox / Pick

Main completed scope:

- Phase 13 scope and current-value inventory.
- Development-only hitbox debug overlay.
- Shared AttackTiming model and per-fighter initial timing values.
- Fighter hitbox width / height / `attackYOffset` tuning.
- Pick compatibility cleanup and same-hit add-on damage.
- Minimal Pick UI text updates.
- Manual playtest checklist and checkpoint report in `docs/phase-13-checkpoint.md`.

### Phase 14: Combat Visualization / Fighter Presentation / Background & Fullscreen

Checkpoint status: **complete and visually frozen for now**.

Main completed scope:

- Four fighter base sprites integrated for current roster presentation.
- Attack / hit / guard / Just Guard / Critical visual effects integrated into BattleScene.
- Three backgrounds supported in BattleScene:
  - `bg_music_studio_pixel.png`
  - `bg_live_house_pixel.png`
  - `bg_summer_festival_pixel.png`
- Normal play uses random background selection.
- Development-only background cycling is available for background checks.
- Fullscreen / viewport support has a trial implementation.
- Checkpoint and freeze decision are documented in `docs/phase14-checkpoint-report.md`.

Frozen / deferred from Phase 14:

- Fullscreen / viewport final stabilization.
- Per-background brightness tuning.
- Effect scale / alpha / duration fine tuning.
- Attack / Guard / Hit fighter sprite variants.
- Title logo / Home visual final direction.
- Player-facing background selection UI.

### Phase 15: SE Implementation

Checkpoint status: **complete for v1.0 progress**.

Main completed scope:

- UI confirm / cancel SE.
- Bass attack SE.
- Drum Sticks target-aware hit SE.
- Keyboard attack hit SE.
- Electric Guitar attack hit SE.
- Normal Guard / Just Guard SE.
- Result KO / Retire / Win SE.
- Detailed SE implementation memo in `docs/se_implementation_memo.md`.
- Checkpoint documented in `docs/phase-15-se-checkpoint.md`.

Deferred from Phase 15:

- Final volume polish.
- Final mix / overlap polish.
- Time Up / Draw / Pick-specific SE.
- Full Defeat SE usage.
- BGM and audio settings UI.

## Current arrival point

Instrument Brawl now has a readable local prototype loop with:

- Four playable fighters.
- Local 2P and P1 vs CPU.
- Equipment Select and equipment prototype behavior.
- Guard / Just Guard, Timer, Retire, Result reasons, Records, Options, and local settings.
- Base fighter sprites, combat visual effects, and three battle backgrounds.
- Initial fullscreen / viewport support, frozen as a trial rather than final.
- Main SE playback routes wired and documented.

## Deferred beyond Phase 0-15 closeout

The following are explicitly later-phase work:

- Final balance.
- Final volume polish.
- Final visual tuning.
- Fullscreen / viewport stabilization.
- Result Flow / Rematch / Navigation Polish.
- Home / Title presentation polish.
- Optional visual tuning pass if needed.

Until v1.0 scope explicitly changes, the project should continue avoiding:

- New fighters.
- Online play.
- 3D conversion.
- Large asset additions.
- Pedal equipment.
- Complex combo systems.
- Story / progression expansion.

## Recommended next candidates

The next focused task should be chosen from:

- **Result Flow / Rematch / Navigation Polish**.
- **Home / Title presentation polish**.
- **Fullscreen / viewport stabilization**.
- **Visual tuning pass if needed**.

These candidates match the Phase 14 checkpoint handoff and keep the project aligned with v1.0 polish rather than new content expansion.
