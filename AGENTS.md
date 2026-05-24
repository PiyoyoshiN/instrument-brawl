# AGENTS.md

## Project

This is a browser-based 1v1 physics fighting game where musical instruments fight each other.

## Tech

- TypeScript
- Vite
- Phaser

## Commands

- npm run dev
- npm run build

## Rules

- Prioritize a playable MVP.
- Keep changes small.
- Do not implement online multiplayer yet.
- Character select exists; keep it minimal and do not overbuild it yet.
- Do not add complex combo systems yet.
- Do not add new fighters, specials, progression, story, timer/rounds/retire runtime, or equipment buffs unless explicitly instructed.
- Phase 8 checkpoint is complete; Phase 9 is in progress.
- Current focus is Phase 9: Equipment Shell & Attack Identity Foundation (docs-first steps before runtime implementation).
- Do not add a full tutorial yet; future help should be a compact in-battle Pause / Quick Help overlay.
- Keep one attack hitting only once unless explicitly instructed otherwise.
- Keep PRs focused: 1 PR = 1 feature.
- Run npm run build after code changes.

## PR titles

- PR titles must include the phase number and concrete task name.
- After Phase 1, do not use generic scaffold/prototype wording.
- Good example: `Phase 2-7: Prepare basic scene flow`.
- Bad examples: `Initial scaffold`, `Initial playable prototype`, `Add Phaser prototype`, `Build tooling and docs`.
