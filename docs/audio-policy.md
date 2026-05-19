# Audio Policy

Phase 5 checkpoint status: audio policy is documented, audio-ready folders exist, but no BGM/SE audio files or playback are added yet.

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

## Current audio-ready folders (no assets)

The repository now includes the audio-ready folder structure:

- `public/assets/audio/bgm/.gitkeep`
- `public/assets/audio/sfx/.gitkeep`

These are empty placeholders only. No `.mp3`, `.wav`, `.ogg`, `.m4a`, `.flac`, or other audio assets are committed.

## Future lightweight settings ideas

Later work may add lightweight audio settings such as:

- `soundEnabled`
- `masterVolume`

Do not build a full settings screen yet. Keep any future audio work small and focused: 1 PR = 1 feature.
