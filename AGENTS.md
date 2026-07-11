# AGENTS.md

## Project

This is a browser-based 3D action game where a chibi hero wields instruments against enemy crowds.
The earlier 2D 1v1 fighting game remains as a separate special-battle mode.

## Tech

- TypeScript
- Vite
- Phaser
- Three.js

## Commands

- npm run dev
- npm run build

## Rules

- Prioritize a playable MVP.
- Keep changes small.
- Do not implement online multiplayer yet.
- Keep the main survival battle 3D. Do not replace the chibi hero with a flat instrument sprite.
- Keep the hero body and held instrument as separate 3D objects.
- Prioritize crowd knockback, hit stop, readable sound pressure, and satisfying attacks over competitive balance.
- Keep survival selection screens balanced across the full safe area; do not return to a left-preview/right-menu legacy layout.
- Do not use the legacy fighter images in the 3D survival hub or survival result screen.
- Keep the main survival presentation warm and inviting: meadow greens, cream panels, and amber accents instead of blue-black menu and arena palettes.
- Guitar automatic-skill audio should read as a musical chord or sound-pressure hit, not high-pitched horror-style feedback.
- Phase 16 is the active direction: 3D survival action and persistent progression.
- The Phaser 1v1 BattleScene is legacy special-battle content; avoid coupling it to the Three.js survival loop.
- Do not add a full tutorial yet; future help should be a compact in-battle Pause / Quick Help overlay.
- Avoid real-person likenesses for modern musician-inspired bosses. Use clearly original silhouettes, clothing, motion, and names.
- Keep PRs focused: 1 PR = 1 feature.
- Run npm run build after code changes.

## PR titles

- PR titles must include the phase number and concrete task name.
- After Phase 1, do not use generic scaffold/prototype wording.
- Good example: `Phase 2-7: Prepare basic scene flow`.
- Bad examples: `Initial scaffold`, `Initial playable prototype`, `Add Phaser prototype`, `Build tooling and docs`.
