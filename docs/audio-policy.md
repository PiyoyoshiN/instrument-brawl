# Audio Policy

Current status: battle and UI SE playback is implemented. New audio must continue to follow the redistribution rules below.

## Phase 20 synthesized auto-skill SE

The four automatic-instrument skill sounds are original synthesized assets made for this repository. They do not sample songs, games, videos, commercial recordings, or third-party sound libraries.

- `se_auto_guitar_feedback.wav`: synthesized G-major harmony (G3 / B3 / D4 with a soft G4 overtone), shaped as a short warm amplifier chord. The filename remains stable for runtime compatibility; the sound is no longer feedback-like.
- `se_auto_bass_subwoofer.wav`: layered 38 Hz / 76 Hz low-frequency impact.
- `se_auto_drum_bass_drum.wav`: 52 Hz low-frequency body plus a synthesized noise transient.
- `se_auto_keyboard_arpeggiator.wav`: synthesized C5 / E5 / G5 tone sequence with a short echo.

All four files are mono 44.1 kHz 16-bit PCM WAV assets.

## Allowed future audio sources

Future audio committed to this public repository must be safe to redistribute. Allowed sources are:

- Self-made audio.
- CC0 assets.
- Properly credited licensed assets, such as CC-BY, when the required credits are handled in the repository.

## Forbidden audio sources

Do not commit audio from unclear or unsafe sources, including:

- Commercial songs.
- Existing game BGM.
- YouTube audio.
- Unclear-license files.
- Ear-copy recreations of copyrighted tracks.

## Audio folders

The repository now includes the audio-ready folder structure:

- `public/assets/audio/bgm/.gitkeep`
- `public/assets/audio/sfx/.gitkeep`

Runtime SE assets currently live under `public/assets/audio/se/`.

## Future lightweight settings ideas

Later work may add lightweight audio settings such as:

- `soundEnabled`
- `masterVolume`

Do not build a full settings screen yet. Keep any future audio work small and focused: 1 PR = 1 feature.
