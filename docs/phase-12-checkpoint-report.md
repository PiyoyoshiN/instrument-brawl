# Phase 12 Checkpoint Report: Guard / Just Guard / Timer / Retire

## Summary

Phase 12 moved Instrument Brawl from a simple attack-only 1v1 prototype toward a clearer match format. The game now has defensive timing, a 99-second time limit, Time Up outcomes, non-KO Retire / Forfeit endings, and transient result reason display.

This checkpoint is a documentation marker only. It does not claim that final balance, attack tempo, hitbox feel, or UI polish is complete.

## Completed scope

### Guard input

- P1 Guard uses `S`.
- P2 Guard in local 2P uses Down arrow.
- CPU mode still does not add CPU Guard AI.

### Normal Guard

- Guard reduces incoming damage.
- Guard reduces incoming knockback.
- Guard slows movement while held.
- Guard prevents starting a new attack while held.
- Releasing Guard restores normal movement and attack-start behavior.

### Just Guard

- Just Guard uses a 120ms timing window from Guard press.
- Successful Just Guard causes 0 damage.
- Successful Just Guard causes 0 knockback.
- Just Guard has distinct visual feedback from Normal Guard.
- Just Guard feedback should not look like normal damage feedback such as `0` or `CRITICAL 0`.

### Timer and Time Up

- Battles have a 99-second timer.
- The timer starts after the match starts, not during the pre-fight start delay.
- The timer pauses while Pause is open.
- The timer clamps at 0.
- Time Up ends the match:
  - Higher P1 HP gives P1 win.
  - Higher P2 HP gives P2 win.
  - Equal HP gives Draw.

### Result reason display

ResultScene can display why the match ended:

- `KO`
- `TIME UP`
- `RETIRE`
- `DRAW`

These labels are ResultScene display information only and are not saved as reason-specific records.

### Retire / Forfeit

- Pause includes a Retire / Forfeit confirmation flow.
- `1` then `1` confirms P1 Retire.
- `2` then `2` confirms P2 Retire.
- `P` cancels/unpauses from the confirmation flow.
- P1 Retire gives P2 the existing winner result.
- P2 Retire gives P1 the existing winner result.
- Retire passes `matchEndReason: 'retire'` as transient ResultScene data.

### Records and settings

- Records continue to use existing result counters only:
  - P1 wins
  - P2 wins
  - draws
  - CPU matches
  - local 2P matches
- No reason-specific records counters were added.
- No records/settings schema migration was added.
- `matchEndReason` remains transient ResultScene display data only.
- Existing saved records/settings should remain compatible with the current v1 schema.

### Manual playtest checklist

The consolidated Phase 12 manual playtest checklist is in `docs/playtest-checklist.md` under **Phase 12-12 Consolidated Guard / Timer / Retire manual playtest checklist**. Use that checklist before treating Phase 12 as fully verified.

## Non-goals / intentionally unchanged

Phase 12 intentionally did not change:

- Attack tempo.
- Attack startup, active frames, recovery, or cooldown.
- Hitboxes or hurtboxes.
- `attackYOffset`, `attackWidth`, or `attackHeight`.
- Fighter stats.
- HP values.
- Base damage.
- Base knockback.
- Critical chance or critical multiplier.
- Amp reach bonus.
- Case behavior.
- Pick behavior.
- Records/settings schema.
- Round system.
- Online play.
- 3D.
- Audio, images, or external assets.
- New fighters.

## Known limitations and deferred work

- Guard may still feel underused because the current attack tempo is fast.
- This should not be fixed inside Phase 12.
- Attack tempo, hitbox feel, and Pick behavior are deferred to Phase 13.
- ResultScene and broader UI polish can be revisited later if manual playtest finds visual roughness.
- Phase 12 mechanics are foundation-level and may need balance review in Phase 13 and later balancing phases.

## Manual verification status

No full manual playtest was performed as part of this checkpoint documentation PR. Manual verification remains required using `docs/playtest-checklist.md`.

The checklist is ready for checkpoint verification and should be run at minimum across:

- VS CPU flow.
- Local 2P flow.
- 800x600 viewport.
- Laptop-sized viewport.
- Large desktop viewport.

## Recommended next phase

Next recommended direction: **Phase 13: Attack Tempo / Hitbox / Pick**.

Suggested first task:

- **Phase 13-1: Attack Tempo / Hitbox / Pick scope docs**.

Phase 13 should investigate:

- Current attack tempo feeling too fast.
- Guard feeling underused.
- Hitbox readability and fairness.
- Pick mechanics.
- Overall game-feel balance.

Phase 13 should still avoid large unrelated changes and should continue using focused PRs.
