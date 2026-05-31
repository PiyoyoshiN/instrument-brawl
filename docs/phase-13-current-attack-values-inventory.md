# Phase 13-2: Current Attack Values Inventory

## Purpose

Phase 13-2 records the current attack-related implementation before Phase 13 tuning begins. This is an inventory task for later decisions in Phase 13-3 Hitbox Debug Overlay, Phase 13-4 attack timing model introduction, Phase 13-5 attack timing tuning, Phase 13-6 hitbox tuning, and later Pick work.

This document does **not** approve or implement new values. It describes the current main-branch behavior only.

## Source of truth

Use the main branch implementation as the source of truth. Prefer actual code values and behavior over PR titles, previous docs, roadmap summaries, or assumptions.

Primary implementation references checked for this inventory:

- `src/main.ts` constants for attack duration, attack cooldown, equipment effects, Guard, Just Guard, Timer, and critical values.
- `src/main.ts` fighter definitions for fighter stats and body-size overrides.
- `src/main.ts` BattleScene attack creation / active-hit update logic.
- `src/main.ts` EquipmentSelectScene and BattleScene equipment resolution logic.

## Attack timing current state

| Item | Current value / behavior | Source-of-truth note |
| --- | --- | --- |
| `attackDurationMs` | `180` ms | Active attack hitboxes expire at `time + attackDurationMs`. |
| `attackCooldownMs` | `240` ms | Starting an attack sets `fighter.nextAttackAt = time + attackCooldownMs`. |
| Startup | No explicit startup phase exists. | A hitbox is created immediately when `startAttack` succeeds. |
| Active | The hitbox exists immediately and remains active until its `expiresAt` time. | The current active window is effectively the hitbox lifetime. |
| Recovery | No explicit recovery phase exists. | There is no separate post-active recovery state; repeat prevention is handled by `nextAttackAt`. |
| Cooldown / repeat gate | A fighter cannot start another attack while `time < fighter.nextAttackAt`. | This also prevents attack starts while guarding or after match over. |

Current attack flow:

1. Input or CPU logic requests an attack.
2. The request is ignored if the fighter is guarding, the match is over, or `time < fighter.nextAttackAt`.
3. On a valid attack, `nextAttackAt` is set to `time + 240` ms.
4. The attack hitbox is created immediately.
5. The hitbox is stored as an active attack with `expiresAt = time + 180` ms.
6. Active attacks are checked for rectangle overlap each update until they expire.

Because `attackCooldownMs` is 240ms and `attackDurationMs` is 180ms, the current implementation has a repeat gate that extends 60ms beyond the hitbox lifetime. That 60ms is not modeled as named recovery; it is only a consequence of the cooldown being longer than the active hitbox duration.

## Fighter stat inventory

Default fighter body size is `72 x 120`. Only Keyboard overrides the body size.

| Fighter | `maxHp` | `moveSpeed` | `attackDamage` | `knockbackSpeed` | `attackWidth` | `attackHeight` | `attackYOffset` | Body size |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | 100 | 260 | 10 | 520 | 104 | 52 | -8 | default `72 x 120` |
| Bass | 105 | 230 | 10 | 580 | 88 | 86 | 4 | default `72 x 120` |
| Drum Sticks | 80 | 310 | 8 | 420 | 64 | 44 | -4 | default `72 x 120` |
| Keyboard | 95 | 215 | 9 | 500 | 118 | 46 | 0 | override `112 x 70` |

## Hitbox inventory

Current attack hitboxes are simple rectangles.

- Horizontal position: the hitbox is placed in front of the fighter using the fighter body half-width plus half of the effective attack width.
- Vertical position: the hitbox center uses the fighter body `y` plus `attackYOffset`.
- Width: the base width is the fighter's `attackWidth`, plus Amp's reach bonus only when the fighter has compatible Amp reach.
- Height: the hitbox height is the fighter's `attackHeight`.
- Lifetime: the hitbox exists for `attackDurationMs` (`180` ms).
- Collision: overlap uses Phaser rectangle-to-rectangle intersection between the attack hitbox bounds and defender body bounds.

### Base hitbox values

| Fighter | Base `attackWidth` | `attackHeight` | `attackYOffset` |
| --- | ---: | ---: | ---: |
| Electric Guitar | 104 | 52 | -8 |
| Bass | 88 | 86 | 4 |
| Drum Sticks | 64 | 44 | -4 |
| Keyboard | 118 | 46 | 0 |

### Effective attack width with Amp

Amp currently adds `+24` attack width when it is active and compatible. BattleScene treats Amp as compatible with Electric Guitar, Bass, and Keyboard. Drum Sticks + Amp resolves to `none` for battle safety.

| Fighter | Base width | Amp bonus if active | Effective width with Amp |
| --- | ---: | ---: | ---: |
| Electric Guitar | 104 | +24 | 128 |
| Bass | 88 | +24 | 112 |
| Drum Sticks | 64 | n/a | 64 |
| Keyboard | 118 | +24 | 142 |

## Equipment / Pick inventory

| Equipment | Selectable in Equipment Select | Current gameplay effect | Current compatibility behavior |
| --- | --- | --- | --- |
| none | Yes | No support equipment; baseline behavior. | Always valid. |
| Amp | Yes | Adds `+24` attack reach only; no projectile, no damage increase. | Effective for Electric Guitar, Bass, and Keyboard. Drum Sticks + Amp resolves to `none` in battle and displays an incompatibility note in Equipment Select. |
| Pick | Yes | No current gameplay effect. | No runtime compatibility restriction currently exists for Pick. |
| Case | Yes | Reduces non-critical incoming damage with multiplier `0.8`; no knockback / HP / Guard behavior change. | Always valid. |

### Pick current behavior

Pick is present in the equipment ID union and equipment definitions, so it is selectable. Its English definition is:

- `displayName`: `Pick`
- `shortLabel`: `Pick`
- `description`: `Sharper and more precise playing flavor.`
- `conceptRole`: `sharper / precise playing flavor`

Its Japanese display text currently presents it as preparation / no-effect:

- `displayNameJa`: `ピック（準備中）`
- `shortLabelJa`: `ピック`
- `descriptionJa`: `Phase 10では効果なし。後のフェーズで検討。`

There is no Pick-specific damage, hitbox, knockback, timing, Guard, Timer, Retire, Result reason, records, or settings behavior in the current runtime. There is also no current runtime Pick compatibility restriction by fighter.

### Drum Sticks critical relationship

Drum Sticks has a critical prototype when attacking without Case:

- Critical chance: `0.35` (`35%`).
- Critical multiplier: `1.5`.
- Drum Sticks base damage is `8`, so critical damage becomes `floor(8 * 1.5) = 12` before Guard / Just Guard handling.
- Critical hits bypass defender Case reduction because Case reduction is only applied in the non-critical branch.
- Drum Sticks + Case disables the attacker-side critical identity through `canUseDrumSticksCritical`.

## Guard / Just Guard relationship

Phase 13-2 does not change Guard or Just Guard.

Current values and behavior:

- Normal Guard damage multiplier: `0.5`.
- Normal Guard knockback multiplier: `0.5`.
- Normal Guard movement multiplier while held: `0.65`.
- Just Guard window: `120` ms from Guard press.
- Successful Just Guard returns `0` damage.
- Successful Just Guard returns `0` knockback.
- When Just Guard succeeds, the hit is marked as consumed for that attack and Just Guard feedback is shown.
- Guarding prevents starting a new attack.

## Timer / Retire / Result reason / records regression notes

Phase 13-2 is docs-only and does not change Timer, Retire, Result reason, records, or settings behavior.

Current implementation notes relevant to later attack work:

- Match timer duration is `99` seconds.
- Result reason values include `ko`, `time_up`, `retire`, and `draw`.
- `matchEndReason` is transient ResultScene display data.
- Result reasons are intentionally not recorded; v1 records remain result-only.
- Records storage version and settings storage version remain unchanged.

Later attack timing, hitbox, or Pick PRs must preserve Timer / Retire / Result reason flow and must not introduce records/settings schema changes unless a separate explicitly scoped task approves that work.

## One attack one hit current state

The one-attack-one-hit rule is currently preserved by the `hasHit` flag stored on each active attack.

Current behavior:

- A new active attack starts with `hasHit: false`.
- On the first defender overlap, the attack sets `hasHit = true` before applying damage or Just Guard feedback.
- Future updates skip collision application for that attack when `attack.hasHit` is true.
- This means each active attack can affect its defender only once, including Just Guard success consuming that attack's hit.

## Phase 13-3 Hitbox Debug Overlay note

Phase 13-3 adds a development-only BattleScene Hitbox Debug Overlay. Press `H` during BattleScene to toggle it on or off. The overlay is normally off, is not saved to localStorage, and does not change attack timing, hitbox values, equipment behavior, Guard, Timer, Retire, Result reason, or records/settings schema.

When enabled, the overlay draws P1/P2 body rectangles, fighter center markers, attack direction / `attackYOffset` guide markers, and currently active attack hitboxes using the same rectangle bounds used by collision checks. Amp-compatible attack widths appear through the actual active attack hitbox because the runtime hitbox already uses effective attack width.

## Findings for later Phase 13 tasks

These are inventory findings only, not approved tuning decisions:

- **13-3 Hitbox Debug Overlay** now provides development-only visibility for current body rectangles, active hitbox bounds, attack direction, and `attackYOffset` markers before tuning.
- **13-4 attack timing model** should explicitly decide how startup, active, recovery, and cooldown relate because current startup and recovery are not named runtime phases.
- **13-5 timing tuning** should evaluate whether the current `180` ms active duration and `240` ms repeat gate make Guard difficult to use before changing Guard values.
- **13-6 hitbox tuning** should review fighter identity and fairness using the current width / height / offset table before changing values.
- **13-7 / 13-8 Pick work** should keep Pick as a main-hit add-on if implemented later, because current Pick has no gameplay effect and no compatibility restriction.

## Phase 13-2 verification expectation

Phase 13-2 should leave runtime behavior unchanged. Verification should confirm:

- Documentation-only changes.
- No TypeScript runtime source changes.
- No changes to attack timing values.
- No changes to hitbox width / height / `attackYOffset` values.
- No Pick gameplay or compatibility changes.
- No Guard / Just Guard value changes.
- No Timer / Retire / Result reason changes.
- No records/settings schema changes.
- `npm run build` was run if possible, or the reason it was not run is documented.
