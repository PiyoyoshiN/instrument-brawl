# Phase 13: Attack Tempo / Hitbox / Pick Scope

Phase 13 is the next focused gameplay-feel phase after Phase 12 introduced Guard, Just Guard, Timer, Retire / Forfeit, Time Up, and Result reason display.

The purpose of Phase 13 is fixed to **Attack Tempo / Hitbox / Pick**. Before directly strengthening Guard or adding new systems, Phase 13 should make the existing basic attack feel easier to read, fairer to collide with, and clearer in relation to Pick.

Phase 13-1 is a docs-first organization task. It must not change runtime values or gameplay behavior.

## Primary goals

1. Clarify current attack tempo and the vocabulary used for future timing work.
2. Inventory current attack values before tuning them.
3. Add tooling / visibility for hitbox review before changing hitbox numbers.
4. Tune attack timing and hitbox values only through later focused PRs.
5. Define Pick as a future small add-on to the main attack hit, not as a separate attack system.
6. Preserve Phase 11 viewport-aware UI behavior and Phase 12 match-rule behavior while evaluating attack feel.

Guard may feel weak or underused with the current fast attack tempo. Phase 13 should first verify attack startup / active / recovery / cooldown feel, hitbox readability, and Pick direction before changing Guard / Just Guard numbers.

## Strict non-goals

Phase 13 must not become a broad content or mechanics expansion phase.

- Do not add new fighters.
- Do not add online multiplayer.
- Do not convert the game to 3D.
- Do not add sound, images, or external assets.
- Do not add pedal equipment.
- Do not add specials, combo systems, progression, story, rounds, or large UI rewrites.
- Do not change records/settings schema.
- Do not change Timer / Retire / Time Up / Result reason behavior.
- Do not change Guard / Just Guard numbers as part of attack-tempo, hitbox, or Pick PRs.
- Do not change runtime attack values in Phase 13-1.
- Do not change `attackDurationMs` or `attackCooldownMs` runtime behavior in Phase 13-1.
- Do not change hitbox `attackWidth`, `attackHeight`, or `attackYOffset` runtime values in Phase 13-1.
- Do not implement Pick gameplay effects in Phase 13-1.
- Do not add runtime Pick compatibility restrictions in Phase 13-1.
- Do not mix Attack timing, Hitbox tuning, and Pick implementation into one giant PR.

## Phase 13 task order

1. **13-1**: Phase 13 scope docs / non-goals / task order / current value inventory policy.
2. **13-2**: Current attack values inventory.
3. **13-3**: Hitbox Debug Overlay.
4. **13-4**: Attack startup / active / recovery / cooldown model introduction.
5. **13-5**: Character attack timing initial tuning.
6. **13-6**: Hitbox width / height / `attackYOffset` tuning.
7. **13-7**: Pick compatibility cleanup.
8. **13-8**: Pick add-on damage implementation.
9. **13-9**: Minimal UI text updates for Pick / unsupported notes.
10. **13-10**: Manual playtest checklist update.
11. **13-11**: Phase 13 checkpoint docs.

Keep each task as one focused feature or one focused review topic. If a later task uncovers unrelated UI, Guard, Timer, Retire, schema, or balance issues, record them as follow-up notes instead of expanding the current PR.

## Current value inventory policy

Phase 13-2 should inventory the current implementation before any tuning PR changes values. The inventory should cite the exact source values and describe behavior rather than only copying PR titles or prior docs.

Inventory must cover:

- `attackDurationMs`.
- `attackCooldownMs`.
- Fighter stats for each current fighter:
  - HP / `maxHp`.
  - `moveSpeed`.
  - `attackDamage`.
  - `knockbackSpeed`.
  - `attackWidth`.
  - `attackHeight`.
  - `attackYOffset`.
  - body size where it differs from default body size.
- Current hitbox width / height behavior, including equipment reach modifiers such as Amp where relevant.
- Current `attackYOffset` placement behavior.
- Current Pick behavior:
  - Pick is selectable / displayable equipment.
  - Pick is currently presented as `準備中` / no-effect.
  - Pick currently has no gameplay effect.
- Current Guard / Just Guard relationship:
  - Guard reduces incoming damage and knockback.
  - Just Guard uses the current timing window and causes no damage / no knockback on success.
  - Guard tuning is not the first lever for Phase 13 if attack tempo or hitboxes are the root issue.
- Current Timer / Retire / Result reason relationship:
  - Match timer and Retire / Forfeit flows must remain intact during attack and Pick work.
  - Result reason display must remain transient and must not add records/schema fields.
- Current one-attack-one-hit behavior:
  - Each attack should still hit a target only once unless a future task explicitly changes that rule.

Inventory should prefer the main branch's actual source and manual runtime behavior over PR titles, PR bodies, assumptions, or stale roadmap wording.

## Attack timing terminology

Phase 13 will use these terms consistently:

- **Startup**: the delay after attack input before the hitbox can hit. Startup is the readable warning / wind-up period. The current runtime effectively has no separate startup model because the hitbox is created immediately when an attack starts.
- **Active**: the time window where the attack hitbox can collide with the defender. Current active duration is represented by the existing attack hitbox lifetime.
- **Recovery**: the post-active period where the attack has ended but the attacker is still not ready to act again. A recovery model can make whiffed or blocked attacks easier to punish, but should be introduced carefully.
- **Cooldown**: the total lockout / gating interval before another attack may start. Cooldown can include startup, active, and recovery depending on implementation, so future docs and code should state whether cooldown is a separate timer or the umbrella attack-repeat timer.

When Phase 13 introduces a timing model, document whether each fighter uses shared defaults or per-fighter values. Do not call candidate values final until they have been playtested.

## Initial candidate values, not final tuning

Any numbers below are **initial candidates** for discussion and playtest only. They are not approved final values and must not be implemented in Phase 13-1.

Potential initial candidate direction:

- Add a small startup window so attacks are easier to read before becoming active.
- Keep active time short enough to preserve one-hit attack clarity.
- Add enough recovery that missed attacks have some commitment.
- Re-evaluate the current cooldown after startup / active / recovery are explicit.
- Start with shared defaults first, then use per-fighter timing only if shared timing makes fighter identity worse.

Example initial candidate ranges for later investigation:

| Timing part | Initial candidate range | Notes |
| --- | ---: | --- |
| Startup | 60-120ms | Readability window before hitbox can hit. |
| Active | 120-180ms | Should preserve current simple one-hit feel. |
| Recovery | 80-180ms | Creates commitment after active frames. |
| Cooldown / repeat gate | 280-420ms | Should be reviewed after explicit timing model exists. |

These candidates are intentionally broad. Phase 13-2 inventory and Phase 13-3 hitbox debug visibility should happen before treating any number as a real tuning target.

## Pick direction

Pick is planned as a future light offensive add-on, but not in Phase 13-1.

Preferred future behavior:

- Pick adds a small amount of extra damage when the main attack successfully hits.
- Pick uses the existing main attack hit event.
- Pick respects the one-attack-one-hit rule.
- Pick does not create a separate hitbox.
- Pick does not create a multi-hit attack.
- Pick does not add extra knockback.
- Pick should avoid making Guard / Just Guard, Timer, Retire, Result reason, or records/settings schema more complex.

Pick compatibility cleanup should happen before Pick damage implementation. If Pick is unsupported for some fighters, runtime restrictions and UI text should be addressed in focused later tasks, not in Phase 13-1.

## Regression guardrails

Phase 13 must preserve earlier phase stability:

- Preserve Phase 11 viewport-aware UI behavior.
- Do not regress visible HP bars, equipment labels, battle instructions, Character Select layout, or footer readability.
- Preserve Phase 12 Timer behavior.
- Preserve Phase 12 Guard / Just Guard behavior and numbers unless a later explicitly scoped Guard task is created.
- Preserve Phase 12 Retire / Forfeit behavior.
- Preserve Phase 12 Result reason display behavior.
- Preserve records/settings schema and existing localStorage compatibility.
- Preserve local 2P and VS CPU scene flow.
- Preserve one attack hitting only once.

## PR review guardrails

For Phase 13 PR reviews, prioritize evidence from the actual branch over summary text:

1. Review changed files.
2. Review the actual diff.
3. Compare against main branch reality.
4. Verify actual runtime behavior where relevant.
5. Treat PR titles and PR body summaries as secondary context, not proof.

Additional PR rules:

- Use focused PRs: **1 PR = 1 feature** or **1 PR = 1 review topic**.
- Do not mix Attack timing, Hitbox tuning, and Pick implementation into a giant PR.
- Do not hide Guard / Just Guard, Timer / Retire, Result reason, records/schema, or unrelated UI changes inside attack-tuning PRs.
- Run `npm run build` when possible.
- If build cannot be run, write the reason clearly in the PR and handoff notes.
- For runtime tasks, include a short manual verification note for local 2P and VS CPU when practical.

## Phase 13-1 verification expectation

Phase 13-1 should leave runtime behavior unchanged. Verification should confirm:

- Only docs or roadmap files changed.
- No TypeScript runtime source was modified.
- `npm run build` was run if possible.
- If `npm run build` was not run, the reason is documented.
