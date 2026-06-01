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
| `AttackTiming.startupMs` | Per-fighter values in Phase 13-5. | Startup is the delay before the active hitbox appears. |
| `AttackTiming.activeMs` | Per-fighter values in Phase 13-5. | Active attack hitboxes expire at active start time + `activeMs`. |
| `AttackTiming.recoveryMs` | Per-fighter values in Phase 13-5. | Recovery is recorded as the gap between active end and cooldown end; it does not add movement restrictions in 13-5. |
| `AttackTiming.cooldownMs` | Per-fighter values in Phase 13-5. | Starting an attack sets `fighter.nextAttackAt = time + cooldownMs`. |
| Startup | Explicit per-fighter phase. | A hitbox is queued and appears after startup; Drum Sticks has the shortest startup, Bass / Keyboard are slower. |
| Active | The hitbox exists only during the active window. | Hitbox Debug Overlay still draws active hitboxes from the runtime hitbox bounds. |
| Recovery | Explicit model value only. | Recovery currently does not restrict movement or add new behavior; repeat prevention is still handled by `nextAttackAt`. |
| Cooldown / repeat gate | A fighter cannot start another attack while `time < fighter.nextAttackAt`. | This also prevents attack starts while guarding or after match over. |

Current attack flow:

1. Input or CPU logic requests an attack.
2. The request is ignored if the fighter is guarding, the match is over, or `time < fighter.nextAttackAt`.
3. On a valid attack, `nextAttackAt` is set to `time + cooldownMs` for the attacker's fighter timing.
4. The attack is queued for startup based on the attacker's per-fighter `startupMs`.
5. When startup completes, the hitbox is created and stored as an active attack with `expiresAt = activeStartedAt + activeMs`.
6. Active attacks are checked for rectangle overlap each update until they expire.

Phase 13-5 changes the shared Phase 13-4 timing defaults into per-fighter initial timing. Recovery remains a timing concept only; it does not add movement lockout or new behavior.

## Fighter stat inventory

Default fighter body size is `72 x 120`. Only Keyboard overrides the body size.

| Fighter | `maxHp` | `moveSpeed` | `attackDamage` | `knockbackSpeed` | `attackWidth` | `attackHeight` | `attackYOffset` | Body size |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | 100 | 260 | 10 | 520 | 108 | 52 | -8 | default `72 x 120` |
| Bass | 105 | 230 | 10 | 580 | 96 | 86 | 4 | default `72 x 120` |
| Drum Sticks | 80 | 310 | 8 | 420 | 62 | 42 | -4 | default `72 x 120` |
| Keyboard | 95 | 215 | 9 | 500 | 120 | 52 | 0 | override `112 x 70` |

## Hitbox inventory

Current attack hitboxes are simple rectangles.

- Horizontal position: the hitbox is placed in front of the fighter using the fighter body half-width plus half of the effective attack width.
- Vertical position: the hitbox center uses the fighter body `y` plus `attackYOffset`.
- Width: the base width is the fighter's `attackWidth`, plus Amp's reach bonus only when the fighter has compatible Amp reach.
- Height: the hitbox height is the fighter's `attackHeight`.
- Lifetime: the hitbox exists for the attacker fighter's current `AttackTiming.activeMs`.
- Collision: overlap uses Phaser rectangle-to-rectangle intersection between the attack hitbox bounds and defender body bounds.

### Base hitbox values

| Fighter | Base `attackWidth` | `attackHeight` | `attackYOffset` |
| --- | ---: | ---: | ---: |
| Electric Guitar | 108 | 52 | -8 |
| Bass | 96 | 86 | 4 |
| Drum Sticks | 62 | 42 | -4 |
| Keyboard | 120 | 52 | 0 |

### Effective attack width with Amp

Amp currently adds `+24` attack width when it is active and compatible. BattleScene treats Amp as compatible with Electric Guitar, Bass, and Keyboard. Drum Sticks + Amp resolves to `none` for battle safety.

| Fighter | Base width | Amp bonus if active | Effective width with Amp |
| --- | ---: | ---: | ---: |
| Electric Guitar | 108 | +24 | 132 |
| Bass | 96 | +24 | 120 |
| Drum Sticks | 62 | n/a | 62 |
| Keyboard | 120 | +24 | 144 |

## Equipment / Pick inventory

| Equipment | Selectable in Equipment Select | Current gameplay effect | Current compatibility behavior |
| --- | --- | --- | --- |
| none | Yes | No support equipment; baseline behavior. | Always valid. |
| Amp | Yes | Adds `+24` attack reach only; no projectile, no damage increase. | Effective for Electric Guitar, Bass, and Keyboard. Drum Sticks + Amp resolves to `none` in battle and displays an incompatibility note in Equipment Select. |
| Pick | Yes | Electric Guitar / Bass add-on damage on the same successful main hit; no separate hitbox / hit / knockback. | Electric Guitar and Bass compatible. Drum Sticks and Keyboard resolve to `none` in battle and display an incompatibility note in Equipment Select. |
| Case | Yes | Reduces non-critical incoming damage with multiplier `0.8`; no knockback / HP / Guard behavior change. | Always valid. |

### Pick current behavior

Pick is present in the equipment ID union and equipment definitions, so it is selectable. Its English definition is:

- `displayName`: `Pick`
- `shortLabel`: `Pick`
- `description`: `Sharper and more precise playing flavor.`
- `conceptRole`: `sharper / precise playing flavor`

Its Japanese display text currently presents the implemented same-hit add-on damage:

- `displayNameJa`: `ピック`
- `shortLabelJa`: `ピック`
- `descriptionJa`: `エレキギター・ベース対応。命中時に同じ1ヒット内で追加ダメージ（通常+1、20%で+4）。`

Phase 13-8 adds Pick-specific add-on damage only for compatible Electric Guitar / Bass attacks. Pick still does not add a hitbox, second hit, knockback, timing change, Guard change, Timer / Retire / Result reason behavior, records fields, or settings schema. Drum Sticks / Keyboard still resolve Pick to `none` in BattleScene.

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

## Phase 13-4 behavior-preserving timing model note

Phase 13-4 introduces a shared `AttackTiming` model with `startupMs = 0`, `activeMs = 180`, `recoveryMs = 60`, and `cooldownMs = 240`. This preserves the previous immediate-hitbox / 180ms-active / 240ms-repeat-gate behavior while giving later Phase 13 tasks clear startup / active / recovery / cooldown fields to tune. Recovery is not a movement lockout or new action state in 13-4.


## Phase 13-5 character attack timing initial tuning

Phase 13-5 changes attack timing from shared defaults to per-fighter initial values. These values are the first runtime tuning pass for attack tempo and are still subject to later playtest follow-up.

| Fighter | `startupMs` | `activeMs` | `recoveryMs` | `cooldownMs` | Intent |
| --- | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | 90 | 100 | 560 | 750 | Standard tempo; readable but not extremely slow. |
| Bass | 130 | 120 | 650 | 900 | Heavy tempo with more whiff commitment. |
| Drum Sticks | 40 | 70 | 140 | 250 | Fast short-reach tempo with a short active window. |
| Keyboard | 120 | 130 | 750 | 1000 | Slowest tempo because Keyboard already controls wide space. |

The `cooldownMs` value remains the actual repeat gate for when the next attack can start. Startup now delays hitbox creation, active controls hitbox lifetime, and recovery remains a documented timing segment rather than a new movement/action lockout.

Follow-up notes for later Phase 13 tasks: startup-time Guard input, facing changes during startup, and movement during startup should be observed during playtest before becoming stricter rules.


## Phase 13-6 hitbox width / height / attackYOffset tuning

Phase 13-6 lightly adjusts hitbox width / height / `attackYOffset` after the Phase 13-5 timing pass. This task does not change AttackTiming, damage, knockback, HP, move speed, body size, Pick, Guard, Timer, Retire, Result reason, or records/settings schema.

| Fighter | Previous `attackWidth` | Previous `attackHeight` | Previous `attackYOffset` | Phase 13-6 `attackWidth` | Phase 13-6 `attackHeight` | Phase 13-6 `attackYOffset` | Intent |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Electric Guitar | 104 | 52 | -8 | 108 | 52 | -8 | Slightly improves horizontal reliability for the standard fighter. |
| Bass | 88 | 86 | 4 | 96 | 86 | 4 | Adds enough reach to fit the slower heavy attack tempo. |
| Drum Sticks | 64 | 44 | -4 | 62 | 42 | -4 | Slightly reduces the hitbox because Drum Sticks has a fast short-cooldown tempo. |
| Keyboard | 118 | 46 | 0 | 120 | 52 | 0 | Adds vertical presence for the slow area-control fighter. |

With Amp, effective attack width remains `attackWidth + 24` for compatible fighters: Electric Guitar `132`, Bass `120`, and Keyboard `144`. Drum Sticks + Amp remains battle-side `none` and keeps width `62`.


## Phase 13-7 Pick compatibility cleanup

Phase 13-7 makes Pick an Electric Guitar / Bass compatible equipment choice while keeping Pick gameplay effect unimplemented until Phase 13-8.

| Fighter | Pick compatibility | Battle resolution | Gameplay effect in 13-7 |
| --- | --- | --- | --- |
| Electric Guitar | Compatible | `pick` remains `pick` | No damage / critical / knockback effect yet. |
| Bass | Compatible | `pick` remains `pick` | No damage / critical / knockback effect yet. |
| Drum Sticks | Incompatible | `pick` resolves to `none` | No Pick effect. |
| Keyboard | Incompatible | `pick` resolves to `none` | No Pick effect. |

Equipment Select displays a compact incompatibility note when Pick is focused for an unsupported fighter. BattleScene still safely resolves stale or saved incompatible Pick selections to `none`, so no settings schema migration is required.


## Phase 13-8 Pick add-on damage implementation

Phase 13-8 gives compatible Pick users a small add-on damage effect inside the same successful main attack hit. Pick remains incompatible with Drum Sticks and Keyboard.

| Pick value | Current value | Notes |
| --- | ---: | --- |
| Normal add-on damage | `+1` | Added to base damage before Case and Guard calculations. |
| Critical add-on damage | `+4` | Replaces the normal Pick add-on when the Pick critical roll succeeds. |
| Pick critical rate | `20%` | Rolled once on successful hit only. |

Pick add-on damage order:

1. Determine attacker base damage.
2. Roll Pick add-on only if the attacker is Electric Guitar / Bass with battle-resolved `pick` equipment.
3. Add Pick add-on damage to base damage.
4. Apply defender Case reduction to the combined damage when applicable.
5. Apply Guard / Just Guard reduction to the resulting damage.
6. Apply the final damage to HP.

Important behavior constraints:

- Pick does not create a separate hitbox.
- Pick does not create a second hit.
- Pick does not consume `hasHit` more than once.
- Pick does not add knockback.
- Pick critical affects only the add-on amount, not the base attack damage.
- Just Guard reduces the full base + Pick add-on damage to `0`.
- Normal Guard reduces the combined base + Pick add-on damage.
- Case reduces the combined base + Pick add-on damage before Guard / Just Guard.


## Phase 13-9 minimal Pick UI text update

Phase 13-9 updates Pick-facing Japanese UI text only. The player-facing Pick label is now `ピック` instead of `ピック（準備中）`, and the Equipment Select description now explains the implemented add-on damage: `エレキギター・ベース対応。命中時に同じ1ヒット内で追加ダメージ（通常+1、20%で+4）。`

The unsupported note remains compact: `このキャラはピック非対応。バトルでは装備なし扱い。`

This is a text-only follow-up. It does not change Pick damage values, Pick compatibility, AttackTiming, hitbox values, Guard / Just Guard, Case, Timer, Retire, Result reason, records/settings schema, or Hitbox Debug Overlay controls.

## Findings for later Phase 13 tasks

These are inventory findings only, not approved tuning decisions:

- **13-3 Hitbox Debug Overlay** now provides development-only visibility for current body rectangles, active hitbox bounds, attack direction, and `attackYOffset` markers before tuning.
- **13-4 attack timing model** now makes startup, active, recovery, and cooldown explicit while preserving current shared timing behavior.
- **13-5 timing tuning** now gives each fighter initial startup / active / recovery / cooldown values; playtest should verify Guard readability before changing Guard values.
- **13-6 hitbox tuning** now applies a small width / height / `attackYOffset` pass aligned to Phase 13-5 attack tempo.
- **13-7 Pick compatibility cleanup** now restricts Pick compatibility to Electric Guitar / Bass.
- **13-8 Pick add-on damage** now adds same-hit Pick damage for compatible Pick users without adding hitboxes, second hits, or knockback.
- **13-9 Pick UI text** updates Pick labels/descriptions to match the implemented add-on damage while preserving unsupported notes.

## Phase 13 inventory / tuning verification expectation

Phase 13 follow-up tasks should keep unrelated systems unchanged unless explicitly scoped otherwise. Verification should confirm:

- The PR changes only its scoped Phase 13 task.
- Hitbox width / height / `attackYOffset` values are unchanged unless the task is explicitly hitbox tuning.
- Pick gameplay and compatibility are unchanged unless the task is explicitly Pick work.
- Guard / Just Guard values are unchanged unless the task is explicitly Guard work.
- Timer / Retire / Result reason behavior is unchanged unless explicitly scoped.
- Records/settings schema are unchanged unless explicitly scoped.
- `npm run build` was run if possible, or the reason it was not run is documented.
