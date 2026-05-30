# Phase 12: Guard / Just Guard / Timer / Retire / Match Rule Scope

## Purpose

Phase 12 is the next gameplay/system phase after the Phase 11 UI Layout Rework checkpoint. It moves Instrument Brawl from a simple attack-only 1v1 format toward a clearer match format with defensive choice, timing defense, a match timer, time-up resolution, and a safe retire/forfeit flow.

Phase 12 should stay incremental: define the rules first, implement one focused system at a time, and preserve the current playable MVP while adding match-rule depth.

## Goals

- Add a basic Guard action as a defensive choice.
- Add Just Guard as a timing-based defensive reward.
- Add a 99-second match timer.
- Add time-up result handling: higher HP wins, equal HP is Draw.
- Add a Pause-menu Retire / Forfeit confirmation flow.
- Let Result eventually distinguish KO / TIME_UP / RETIRE / DRAW for player-facing clarity.
- Keep records v1 using the existing win/loss/draw/match counters unless a later task explicitly approves reason-specific saved counters.
- Preserve Phase 11 viewport-aware UI guardrails while adding match-rule UI.

## Non-goals

Phase 12 must not become a broad combat rebalance or content expansion phase.

- Do not change attack tempo, startup, active frames, recovery, or cooldown.
- Do not change hitbox, hurtbox, `attackYOffset`, `attackWidth`, or `attackHeight`.
- Do not change HP, base damage, or base knockback.
- Do not change fighter stats.
- Do not redesign Case, Amp, Drum Sticks critical, or Pick preparation behavior.
- Do not implement Pick effects unless a later Phase 12+ task explicitly asks for it.
- Do not add new fighters, online play, 3D, audio, images, or external assets.
- Do not perform records/settings schema migration in Phase 12-1.
- Do not add a round system in the first Phase 12 pass; rounds are deferred.
- Do not do a large UI redesign beyond text/checklist updates needed for the specific task.

## Initial design defaults

These are the starting defaults to document and verify before runtime work begins. Later implementation PRs may tune values only when that task explicitly calls for tuning.

| Area | Initial default |
| --- | --- |
| P1 Guard input | `S` key |
| P2 Guard input | Down arrow |
| Guard + attacks | Guard disables starting new attacks while held |
| Guard movement | About 65% movement speed while guarding |
| Normal Guard damage | 50% final damage |
| Normal Guard knockback | 50% knockback |
| Just Guard window | 120ms from guard press |
| Just Guard success | 0 damage and 0 knockback |
| Timer | 99 seconds |
| Pause behavior | Timer stops during Pause |
| Time up | Higher HP wins; equal HP is Draw |
| Retire / Forfeit | Pause menu confirmation flow |
| Round system | Deferred for now |
| Result reason | Eventually distinguish KO / TIME_UP / RETIRE / DRAW |
| Records v1 | Reuse existing win/loss/draw/match counters; no reason-specific saved counters by default |

Suggested internal identifiers, if needed later, should stay English, for example `ko`, `time_up`, `retire`, and `draw`. Player-facing wording may use Japanese where appropriate.

## Recommended implementation order

1. **12-1** Guard / Just Guard / Timer / Retire / Match Rule scope docs.
2. **12-2** Guard input and guard state foundation.
3. **12-3** Normal Guard damage/knockback reduction.
4. **12-4** Guard movement and attack-start lockout while guarding.
5. **12-5** Just Guard timing window and successful block behavior.
6. **12-6** Guard / Just Guard visual and HUD feedback, minimal and readable.
7. **12-7** 99-second timer foundation.
8. **12-8** Timer pause behavior and time-up result logic.
9. **12-9** Result reason handoff/display for KO / TIME_UP / RETIRE / DRAW without records schema expansion.
10. **12-10** Pause menu Retire / Forfeit confirmation flow.
11. **12-11** Records/settings schema sanity check for Phase 12.
12. **12-12** Manual playtest checklist update for Guard / Just Guard / Timer / Retire.
13. **12-13** Phase 12 checkpoint docs.

Keep each runtime PR focused. If one step reveals that a value needs tuning, document it and prefer a small follow-up rather than bundling broad balance changes.

## Implementation guardrails

- Preserve the current attack cadence unless a later explicit tuning task changes it.
- Keep one attack hitting only once unless a later explicit task changes that rule.
- Guard should be defensive state, not a new attack or counterattack system.
- Just Guard should prevent damage/knockback on success, not add damage or special effects by default.
- Timer and Retire should not change existing KO win/draw behavior except where time-up or retire explicitly applies.
- Pause must stop the timer and must keep the existing pause/resume flow stable.
- Retire / Forfeit must use confirmation to avoid accidental match loss.
- Result reason display should not require records schema expansion in v1.
- Records should continue to use existing match/win/loss/draw counters unless a later task explicitly approves schema changes.
- Settings schema should remain unchanged unless a later task explicitly adds a setting.
- Preserve Phase 11 viewport-aware UI guardrails: do not regress HP bars, Character Select layout, footer visibility, or Japanese UI readability.

## Phase 12 PR review rules

Review Phase 12 PRs by actual diff and behavior, not just title wording.

- One PR should cover one focused Phase 12 task.
- Runtime PRs must call out whether gameplay values, hitboxes, fighter stats, equipment effects, records schema, or settings schema changed.
- Any change to attack tempo, attack dimensions, fighter stats, equipment behavior, records schema, or settings schema should be rejected unless it is explicitly part of the requested task.
- UI additions for timer, guard, result reason, or retire must respect Phase 11 layout guardrails and avoid Japanese overflow/overlap.
- PRs should include `npm run build` verification when runtime files change.
- Docs-only PRs should verify that scope, non-goals, defaults, and guardrails are clear.

## Manual playtest direction

When runtime implementation begins, add Phase 12 checklist coverage to `docs/playtest-checklist.md`.

Initial manual checks should include:

- Guard input works for P1 with `S` and P2 with Down arrow.
- Guard prevents starting new attacks while held.
- Guard movement is slower, around 65% of normal movement.
- Normal Guard reduces final damage and knockback by about half.
- Just Guard succeeds only during the 120ms timing window from guard press.
- Just Guard success causes 0 damage and 0 knockback.
- Timer starts at 99 seconds.
- Timer stops during Pause and resumes after unpause.
- Time up awards the match to the higher-HP player.
- Equal HP at time up produces Draw.
- Retire / Forfeit requires Pause-menu confirmation.
- Result wording clearly distinguishes KO / TIME_UP / RETIRE / DRAW once that display task is implemented.
- Existing records win/loss/draw/match counters still update correctly without reason-specific saved counters.
- Existing Phase 11 UI guardrails still pass: HP bars visible, Character Select not clipped, footer controls visible, Japanese text readable.

## Phase 11 carry-forward guardrails

Phase 12 UI additions should not undo Phase 11 layout work.

- HP bars must remain visible at 800x600, laptop-sized viewport, and large desktop viewport.
- Character Select must not reintroduce the upper-left huge/clipped regression.
- Footer controls must remain visible and separated from main content.
- Japanese labels must remain readable without shrinking text just to cram it in.
- The deferred ResultScene full-screen/global layout cleanup remains separate from Phase 12-1 scope.
