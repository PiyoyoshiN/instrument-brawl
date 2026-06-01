# Phase 13 Checkpoint: Attack Tempo / Hitbox / Pick

Phase 13 is the checkpoint for making attacks more readable and reviewable before changing Guard / Just Guard directly.

The guiding phrase for this phase:

> 速さを足すな。読める間を作れ。

Phase 12 added Guard, Just Guard, Timer, Retire / Forfeit, Time Up, and Result reason display. Phase 13 then focused on the attacking side first: attack tempo, hitbox visibility/tuning, and Pick behavior. The intent was to make Phase 12 Guard / Just Guard more meaningful in real play by improving attack readability and consistency before buffing defense numbers.

This checkpoint is documentation-only. It does not change runtime behavior, gameplay values, UI text, records/settings schema, or assets.

## Completed Phase 13 tasks

- **Phase 13-1**: Scope docs / non-goals / task order / current value inventory policy.
- **Phase 13-2**: Current attack values inventory.
- **Phase 13-3**: Hitbox Debug Overlay.
- **Phase 13-4**: AttackTiming model introduction.
- **Phase 13-5**: Per-fighter attack timing initial tuning.
- **Phase 13-6**: Hitbox width / height / `attackYOffset` tuning.
- **Phase 13-7**: Pick compatibility cleanup.
- **Phase 13-8**: Pick add-on damage implementation.
- **Phase 13-9**: Minimal UI text updates for Pick / unsupported notes.
- **Phase 13-10**: Manual playtest checklist update.
- **Phase 13-11**: Phase 13 checkpoint docs.

## Final AttackTiming values

| Fighter | `startupMs` | `activeMs` | `recoveryMs` | `cooldownMs` |
| --- | ---: | ---: | ---: | ---: |
| Electric Guitar | 90 | 100 | 560 | 750 |
| Bass | 130 | 120 | 650 | 900 |
| Drum Sticks | 40 | 70 | 140 | 250 |
| Keyboard | 120 | 130 | 750 | 1000 |

Notes:

- `startupMs` delays active hitbox creation.
- `activeMs` controls active hitbox lifetime.
- `cooldownMs` controls the next-attack repeat gate.
- `recoveryMs` is currently a documented timing segment and does not add a separate movement/action lockout.

## Final hitbox values

| Fighter | `attackWidth` | `attackHeight` | `attackYOffset` |
| --- | ---: | ---: | ---: |
| Electric Guitar | 108 | 52 | -8 |
| Bass | 96 | 86 | 4 |
| Drum Sticks | 62 | 42 | -4 |
| Keyboard | 120 | 52 | 0 |

### Amp effective widths

| Fighter + Amp | Effective attack width |
| --- | ---: |
| Electric Guitar + Amp | 132 |
| Bass + Amp | 120 |
| Keyboard + Amp | 144 |
| Drum Sticks + Amp | Battle-side `none` resolution |

Amp remains a reach-only modifier. It does not add damage, projectile behavior, extra hitboxes, or knockback.

## Final Pick specification

### Compatibility

| Fighter | Pick compatibility | Battle behavior |
| --- | --- | --- |
| Electric Guitar | Compatible | Equipment remains `pick`. |
| Bass | Compatible | Equipment remains `pick`. |
| Drum Sticks | Incompatible | Battle resolves Pick to `none`. |
| Keyboard | Incompatible | Battle resolves Pick to `none`. |

### Damage

| Pick value | Final value |
| --- | ---: |
| Normal Pick add-on | `+1` damage |
| Pick critical rate | `20%` |
| Pick critical add-on | `+4` damage |

### Constraints

- Pick is add-on damage inside the same successful main attack hit.
- Pick does not create a separate hitbox.
- Pick does not create a second hit.
- Pick does not add knockback.
- Pick does not consume `hasHit` more than once.
- Pick add-on damage is included in Case / Guard / Just Guard processing.
- On successful Just Guard, base damage plus Pick add-on damage becomes `0`.
- Drum Sticks and Keyboard do not receive Pick effects.

## Systems intentionally unchanged in Phase 13

Phase 13 intentionally did **not** change:

- Guard / Just Guard numeric values.
- Timer behavior.
- Retire / Forfeit behavior.
- Result reason behavior.
- Records schema.
- Settings schema.
- HP values.
- Move speed values.
- Base `attackDamage` values.
- `knockbackSpeed` values.
- New fighters.
- Online play.
- 3D conversion.
- Audio, image, or external asset additions.
- Pedal equipment.
- Large UI rewrites.

## Manual playtest reference

Use `docs/phase-13-manual-playtest-checklist.md` as the manual verification document for this checkpoint.

That checklist covers:

- Basic launch / scene flow.
- Per-fighter AttackTiming feel.
- Hitbox Debug Overlay.
- Final hitbox values and Amp effective widths.
- Pick compatibility.
- Pick add-on damage.
- Guard / Just Guard / Case interactions.
- Timer / Retire / Result behavior.
- Records/settings schema safety.
- Local 2P, VS CPU, and regression flow checks.

No full manual playtest result is claimed by this checkpoint doc. The checklist should be run before treating Phase 13 as fully playtest-verified.

## Handoff to the next phase

Phase 13 establishes initial values, not final balance. The next phase should treat the following as playtest and balance planning inputs:

- AttackTiming values are initial tuning values and may need adjustment after real play.
- Startup-time facing changes, Guard input, and movement behavior should be observed and formalized later only if needed.
- Drum Sticks' `0.25s` tempo may be too strong and needs focused playtest attention.
- Keyboard's `1.0s` tempo plus wider hitbox may be too weak or too strong and needs focused playtest attention.
- Pick + Case + Guard / Just Guard feel should be tested in real matches.
- Pick critical `20% / +4` may be too strong and needs playtest review.
- Before strengthening Guard directly, first verify that Phase 13 attack tempo, hitboxes, and Pick behavior feel readable and fair.

## Recommended next phase

If there is no more urgent bugfix, the next recommended direction is:

**Phase 14: Post-Phase-13 playtest and balance planning**

Suggested first task:

- **Phase 14-1**: Post-Phase-13 playtest findings / balance planning docs.
