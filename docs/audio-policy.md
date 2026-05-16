# Audio Policy

Phase 4 checkpoint status: audio policy is documented, but no BGM/SE audio files or playback are added yet. Future work may prepare audio-ready structure without assets.

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

## Possible future folders

If audio assets are added in a later approved task, use a clear public asset structure such as:

- `public/assets/audio/bgm`
- `public/assets/audio/sfx`

Do not add placeholder `.mp3`, `.wav`, `.ogg`, `.m4a`, or other audio files yet.

## Future lightweight settings ideas

Later Phase 4 work may add lightweight audio settings such as:

- `soundEnabled`
- `masterVolume`

Do not build a full settings screen yet. Keep any future audio work small and focused: 1 PR = 1 feature.
