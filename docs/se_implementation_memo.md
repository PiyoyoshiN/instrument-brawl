# SE Implementation Memo

This memo tracks the currently wired sound effects and intentionally unused registered SE.

## Implemented / wired SE

### UI

- `se_ui_confirm.wav`: major confirm / decision inputs.
- `se_ui_cancel.wav`: back / cancel inputs and pause resume.

### Guard

- `se_guard_common_01.wav`
- `se_guard_common_02.wav`
- `se_just_guard.wav`

Normal Guard uses the two common Guard SE at random. Just Guard uses the dedicated Just Guard SE. Just Guard does not also play Normal Guard or attack-hit SE.

### Attack

- Bass attack-start SE:
  - `se_attack_bass_normal_01.wav`
  - `se_attack_bass_normal_02.wav`
- Drum Sticks hit SE:
  - `se_attack_drum_sticks_vs_keyboard_plastic.wav`
  - `se_attack_drum_sticks_vs_wood_normal_01.wav`
  - `se_attack_drum_sticks_critical_shared_01.wav`
- Electric Guitar hit SE:
  - `se_attack_electric_guitar_normal_01.wav`
  - `se_attack_electric_guitar_normal_02.wav`
  - `se_attack_electric_guitar_critical_01.wav`
  - `se_attack_electric_guitar_critical_02.wav`
- Keyboard hit SE:
  - `se_attack_keyboard_normal_01.wav`
  - `se_attack_keyboard_critical_01.wav`

Attack-hit SE only plays on non-guard hits. Normal Guard uses Guard SE instead; Just Guard uses Just Guard SE instead.

### Result

- KO:
  - `se_result_ko_normal.wav`
  - `se_result_ko_light.wav`
- Retire:
  - `se_result_retire.wav`
- Win:
  - `se_result_win_01.wav`
  - `se_result_win_02.wav`

KO / Retire SE plays from Battle match-end handling. Win SE plays once from ResultScene for KO wins only, delayed by the normal Result transition.

## Registered but currently unused

- `se_attack_bass_critical_01.wav`
- `se_attack_bass_critical_02.wav`
- `se_result_defeat.wav`

Defeat SE is registered but not played because the current game shows a shared result screen. It should not be stacked with WIN SE until a loser-specific presentation exists.

## Notes / non-goals

- Electric Guitar / Keyboard critical SE are registered and routed, but current balance does not add Electric Guitar or Keyboard critical chance. In practice, `isCritical` is still centered on Drum Sticks, so these critical SE may not play in normal gameplay yet.
- This does not add new critical rates, critical damage, damage changes, knockback changes, Guard changes, or hitbox changes.
- Time Up / Draw result SE are not implemented yet.
- Pick / Pick critical SE are not implemented yet.
- Lightweight KO currently means only `drum-sticks` uses `se_result_ko_light.wav`. If future lightweight fighters are added, update `isLightweightFighterForKo`.
