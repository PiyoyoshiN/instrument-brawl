# Phase 15: SE Implementation Checkpoint

## Purpose

Phase 15 is the v1.0 sound-effect checkpoint. Its purpose was to connect the already-added SE assets under `public/assets/audio/se/` to the current prototype, verify the main playback routes, and document what remains intentionally deferred.

This checkpoint is documentation-only. It does not change runtime gameplay, SE routing, volume values, AttackTiming, hitboxes, Pick, Guard / Just Guard, Timer, Retire, Result reason, or storage schemas.

## Checkpoint judgment

**Phase 15 is considered checkpoint complete for v1.0 progress.**

The current implementation is sufficient as a v1.0 checkpoint because the major expected SE categories are wired and documented:

- UI confirm / cancel.
- Bass attack SE.
- Drum Sticks target-aware hit SE.
- Keyboard attack hit SE.
- Electric Guitar attack hit SE.
- Normal Guard / Just Guard SE.
- Result KO / Retire / Win SE.
- `docs/se_implementation_memo.md` records wired, registered-unused, and deferred SE decisions.

Final volume polish, final presentation polish, and final balance checks can remain for Phase 17 or later.

## Completed scope

### UI SE

- Confirm SE is wired for major decision inputs.
- Cancel SE is wired for major back / cancel inputs and pause resume.

### Attack SE

- Bass normal attack SE is wired at accepted attack start and keeps the existing behavior.
- Drum Sticks hit SE is target-aware:
  - Keyboard defender uses the plastic SE.
  - Non-Keyboard defenders use the wood SE.
  - Drum Sticks critical uses the shared critical SE.
- Keyboard normal hit SE is wired.
- Keyboard critical SE is registered and routed, but no new Keyboard critical gameplay was added.
- Electric Guitar normal hit SE is wired with two random variants.
- Electric Guitar critical SE is registered and routed, but no new Electric Guitar critical gameplay was added.

### Guard / Just Guard SE

- Normal Guard uses common Guard SE variants.
- Just Guard uses the dedicated Just Guard SE.
- Just Guard does not also play Normal Guard SE.
- Guarded hits do not stack attack-hit SE on top of Guard SE.

### Result SE

- KO result SE is wired.
- Drum Sticks defeated by KO uses the lightweight KO SE.
- Retire result SE is wired.
- Win SE is wired for KO wins after the normal Result transition.
- Defeat SE is registered but not used yet because the current game uses a shared result screen and should not stack WIN and Defeat simultaneously.

## Confirmed behavior / policy

- Major SE now generally play through the current game flow.
- Normal Guard and Just Guard prioritize Guard-specific SE over attack-hit SE.
- KO / Retire / Win are separated enough for the current single-screen result flow.
- Time Up and Draw remain silent for now.
- Critical SE for Electric Guitar / Keyboard are registration/routing-ready only; Phase 15 did not introduce new critical rates or critical damage.
- SE playback remains a v1.0 checkpoint layer, not a gameplay balance change.

## Deferred / not implemented yet

- Time Up SE.
- Draw SE.
- Pick SE.
- Pick critical SE.
- Full Defeat SE usage / loser-specific result presentation.
- Final volume polish.
- Final mix / overlap polish.
- BGM.
- Audio settings UI.

## Non-goals confirmed

Phase 15 did not intentionally change:

- Damage values.
- Critical rates or critical rules.
- Knockback values.
- AttackTiming values.
- Hitbox width / height / `attackYOffset`.
- Pick damage / compatibility rules.
- Guard / Just Guard numbers or windows.
- Timer / Retire / Result reason behavior.
- CPU behavior.
- Records / settings / localStorage schemas.
- Fighter roster.
- Online play.
- 3D or animation form variants.

## Related docs

- `docs/se_implementation_memo.md` is the detailed SE implementation memo.
- `docs/phase-13-checkpoint.md` remains the Attack Tempo / Hitbox / Pick checkpoint.

## Next direction after Phase 0-15 closeout

Phase 15 remains checkpoint complete for v1.0 progress. Phase 14 has also been checkpointed as visually complete / frozen in `docs/phase14-checkpoint-report.md`, so the project should not loop back into Phase 14 implementation by default.

Recommended next candidates are tracked in `docs/phase-0-15-progress-summary.md` and `docs/roadmap.md`:

- Result Flow / Rematch / Navigation Polish.
- Home / Title presentation polish.
- Fullscreen / viewport stabilization.
- Visual tuning pass if needed.

Final volume polish, final presentation polish, final balance checks, BGM, and audio settings UI remain later-phase work.
