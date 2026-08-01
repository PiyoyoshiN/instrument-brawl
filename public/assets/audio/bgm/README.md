# Battle BGM assets

Place the battle tracks at the following paths.

## Electric Guitar

`public/assets/audio/bgm/bgm_guitar_battle_combo_breaker_blitz.wav`

- First play starts at `0.00` seconds
- Direct loop start: `19.96` seconds
- Direct loop end: `59.54` seconds
- BGM volume: `0.34`

## Bass

`public/assets/audio/bgm/bgm_bass_battle_adopted.wav`

- First play starts at `0.00` seconds
- Direct loop start: `26.997770833333334` seconds
- Direct loop end: `77.52458333333334` seconds
- BGM volume: `0.34`

Playback settings are defined in `src/battle-bgm.ts`. Each track plays only during the current survival battle when its matching instrument is selected. Looping uses Web Audio loop points with no crossfade. Missing audio must not stop the game from running.
