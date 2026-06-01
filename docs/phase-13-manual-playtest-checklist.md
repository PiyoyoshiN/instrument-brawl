# Phase 13-10: Manual Playtest Checklist

Use this checklist before writing the Phase 13 checkpoint docs. Phase 13-10 is documentation-only and does not change runtime behavior, gameplay values, UI text, or schemas.

Phase 13 features covered here:

- Phase 13-4: AttackTiming model.
- Phase 13-5: per-fighter attack timing.
- Phase 13-6: hitbox width / height / `attackYOffset` tuning.
- Phase 13-7: Pick compatibility cleanup.
- Phase 13-8: Pick add-on damage.
- Phase 13-9: Pick UI text update.

## A. Basic launch / scene flow

- [ ] `npm run build` passes.
- [ ] `npm run dev` starts the game locally.
- [ ] Character Select -> Equipment Select -> Battle -> Result flow works.
- [ ] Local 2P battle can start.
- [ ] VS CPU battle can start.

## B. AttackTiming

- [ ] Electric Guitar attack tempo feels close to a `0.75s` repeat gate.
- [ ] Bass attack tempo feels close to a `0.9s` repeat gate.
- [ ] Keyboard attack tempo feels close to a `1.0s` repeat gate.
- [ ] Drum Sticks attack tempo feels close to a `0.25s` repeat gate.
- [ ] During startup, the active hitbox does not appear immediately on input.
- [ ] Active attack hitbox appears only during the active window.
- [ ] Cooldown prevents immediate repeated attacks before the repeat gate ends.
- [ ] One attack still hits only once.

Expected timing values:

| Fighter | `startupMs` | `activeMs` | `recoveryMs` | `cooldownMs` |
| --- | ---: | ---: | ---: | ---: |
| Electric Guitar | 90 | 100 | 560 | 750 |
| Bass | 130 | 120 | 650 | 900 |
| Drum Sticks | 40 | 70 | 140 | 250 |
| Keyboard | 120 | 130 | 750 | 1000 |

## C. Hitbox Debug Overlay

- [ ] Pressing `H` during Battle toggles Hitbox Debug Overlay ON/OFF.
- [ ] Fighter body rectangles are visible when the overlay is ON.
- [ ] Attack direction guide is visible when the overlay is ON.
- [ ] `attackYOffset` marker / guide is visible when the overlay is ON.
- [ ] Active attack hitbox is visible when an attack is active.
- [ ] Overlay OFF returns to the normal battle view without visual breakage.
- [ ] Pause does not break the overlay.
- [ ] Result transition does not break the overlay or scene cleanup.

## D. Hitbox tuning

- [ ] Electric Guitar hitbox is `attackWidth 108 / attackHeight 52 / attackYOffset -8`.
- [ ] Bass hitbox is `attackWidth 96 / attackHeight 86 / attackYOffset 4`.
- [ ] Drum Sticks hitbox is `attackWidth 62 / attackHeight 42 / attackYOffset -4`.
- [ ] Keyboard hitbox is `attackWidth 120 / attackHeight 52 / attackYOffset 0`.
- [ ] With Amp, Electric Guitar effective attack width is `132` (`108 + 24`).
- [ ] With Amp, Bass effective attack width is `120` (`96 + 24`).
- [ ] With Amp, Keyboard effective attack width is `144` (`120 + 24`).
- [ ] Drum Sticks + Amp resolves to `none` in Battle.

## E. Pick compatibility

- [ ] Electric Guitar + Pick remains Pick in Battle.
- [ ] Bass + Pick remains Pick in Battle.
- [ ] Drum Sticks + Pick resolves to `none` in Battle.
- [ ] Keyboard + Pick resolves to `none` in Battle.
- [ ] Equipment Select displays the unsupported Pick note for Drum Sticks / Keyboard.
- [ ] Pick UI text no longer says `準備中`.
- [ ] Pick UI text no longer says the effect is not implemented / no-effect.

Expected unsupported Pick note:

- `このキャラはピック非対応。バトルでは装備なし扱い。`

## F. Pick add-on damage

- [ ] Electric Guitar + Pick applies normal `+1` add-on damage on successful hit.
- [ ] Bass + Pick applies normal `+1` add-on damage on successful hit.
- [ ] Pick critical occurs around `20%` of successful Pick hits and uses `+4` add-on damage.
- [ ] Pick does not create a separate hitbox.
- [ ] Pick does not create a second hit.
- [ ] Pick does not increase knockback.
- [ ] Pick critical affects only the Pick add-on amount, not the base attack damage.
- [ ] Drum Sticks does not receive Pick effect.
- [ ] Keyboard does not receive Pick effect.

Expected Pick values:

| Pick value | Expected value |
| --- | ---: |
| Normal add-on damage | `+1` |
| Critical add-on damage | `+4` |
| Critical rate | `20%` |

## G. Guard / Just Guard / Case

- [ ] During Normal Guard, combined base + Pick add-on damage is reduced.
- [ ] During Just Guard, combined base + Pick add-on damage becomes `0`.
- [ ] Pick does not pierce Just Guard.
- [ ] With defender Case, combined base + Pick add-on damage is Case-reduced.
- [ ] Case + Guard interaction still behaves as expected from Phase 12 / Phase 10 equipment behavior.
- [ ] Drum Sticks critical + Case behavior is unchanged.

## H. Timer / Retire / Result

- [ ] 99-second Timer runs during active battle.
- [ ] Timer stops while Pause is open.
- [ ] Time Up result is decided by HP comparison.
- [ ] Time Up with equal HP results in Draw.
- [ ] Retire confirmation still works.
- [ ] Retire result reason display still works.

## I. Records / settings schema

- [ ] Records schema is unchanged.
- [ ] Settings schema is unchanged.
- [ ] Existing localStorage data loads without migration.
- [ ] If an incompatible Pick selection exists in saved settings, Battle safely resolves it to `none`.
- [ ] Result still updates records normally.

## J. Regression checks

- [ ] In Local 2P, both players can move and attack.
- [ ] In VS CPU, CPU can move and attack.
- [ ] Basic attack flow still works.
- [ ] Basic Guard / Just Guard flow still works.
- [ ] Basic Timer / Time Up flow still works.
- [ ] Basic Pause / Retire flow still works.
- [ ] Basic Result flow still works.
- [ ] Phase 13 docs and runtime behavior do not contradict each other.

## Phase 13-10 non-goals confirmation

- [ ] No runtime source changes were made for Phase 13-10.
- [ ] AttackTiming values were not changed.
- [ ] Hitbox values were not changed.
- [ ] Pick damage / critical / compatibility logic was not changed.
- [ ] Guard / Just Guard / Case behavior was not changed.
- [ ] Timer / Retire / Result reason behavior was not changed.
- [ ] Records/settings schema was not changed.
- [ ] No new fighter, online play, 3D, audio, image, external asset, or pedal equipment was added.
