export type InstrumentId = 'electric-guitar' | 'bass' | 'drum-sticks' | 'keyboard';

export type CommonUpgradeId =
  | 'attack'
  | 'range'
  | 'attackSpeed'
  | 'moveSpeed'
  | 'condition'
  | 'recovery';

export type MaterialId = 'pick' | 'low-string' | 'stick-chip' | 'key-cap';

export type InstrumentDefinition = {
  id: InstrumentId;
  name: string;
  shortName: string;
  imageKey: string;
  color: number;
  materialId: MaterialId;
  materialName: string;
  specialtyName: string;
  specialtyDescription: string;
};

export const instrumentDefinitions: InstrumentDefinition[] = [
  {
    id: 'electric-guitar',
    name: 'エレキギター',
    shortName: 'ギター',
    imageKey: 'fighter-electric-guitar-base',
    color: 0xfacc15,
    materialId: 'pick',
    materialName: '共鳴ピック',
    specialtyName: '貫通出力',
    specialtyDescription: '音波を解放し、強化ごとに射程・貫通数・遠距離威力が伸びる。',
  },
  {
    id: 'bass',
    name: 'ベース',
    shortName: 'ベース',
    imageKey: 'fighter-bass-base',
    color: 0x38bdf8,
    materialId: 'low-string',
    materialName: '重低音弦',
    specialtyName: '低音圧',
    specialtyDescription: '一撃を重くし、衝撃波の大きさと押し返す力を伸ばす。',
  },
  {
    id: 'drum-sticks',
    name: 'ドラムスティック',
    shortName: 'スティック',
    imageKey: 'fighter-drum-sticks-base',
    color: 0xfb923c,
    materialId: 'stick-chip',
    materialName: '刻拍チップ',
    specialtyName: '連打旋回',
    specialtyDescription: '連打数が増え、一定段階から周囲を巻き込む回転攻撃になる。',
  },
  {
    id: 'keyboard',
    name: 'キーボード',
    shortName: '鍵盤',
    imageKey: 'fighter-keyboard-base',
    color: 0xc084fc,
    materialId: 'key-cap',
    materialName: '残響キー',
    specialtyName: '和音展開',
    specialtyDescription: '音符の数と広がりを増やし、複数方向を同時に制圧する。',
  },
];

export const instrumentById = new Map(instrumentDefinitions.map((definition) => [definition.id, definition]));

export const autoSkillDefinitions: Record<InstrumentId, {
  name: string;
  description: string;
  intervalSeconds: number;
}> = {
  'electric-guitar': {
    name: 'ハーモニーアンプ',
    description: '一定間隔で明るい和音を鳴らし、最寄りの敵へ貫通する音圧波を放つ。',
    intervalSeconds: 4.4,
  },
  bass: {
    name: 'サブウーファー',
    description: '一定間隔で足元から重低音を鳴らし、周囲の敵を大きく押し返す。',
    intervalSeconds: 5.2,
  },
  'drum-sticks': {
    name: 'バスドラム',
    description: '一定間隔でバスドラムを自動演奏し、前方へ太い低音衝撃を放つ。',
    intervalSeconds: 3.8,
  },
  keyboard: {
    name: 'アルペジエーター',
    description: '一定間隔で最寄りの敵を狙う自動音符を連続発射する。',
    intervalSeconds: 4.1,
  },
};

export const commonUpgradeDefinitions: Array<{
  id: CommonUpgradeId;
  name: string;
  description: string;
  baseCost: number;
}> = [
  { id: 'attack', name: '攻撃力', description: '与えるダメージ +15%', baseCost: 45 },
  { id: 'range', name: '攻撃範囲', description: '攻撃の大きさ・射程 +10%', baseCost: 40 },
  { id: 'attackSpeed', name: '攻撃速度', description: '攻撃間隔を短縮', baseCost: 55 },
  { id: 'moveSpeed', name: '移動速度', description: 'フィールド移動速度 +6%', baseCost: 35 },
  { id: 'condition', name: '最大コンディション', description: '最大値 +18', baseCost: 50 },
  { id: 'recovery', name: '回復性能', description: '回復アイテムと水準突破回復 +12%', baseCost: 50 },
];

export type SurvivalProgress = {
  version: 1;
  coins: number;
  lifetimeCoins: number;
  bestThreat: number;
  selectedInstrument: InstrumentId;
  commonLevels: Record<CommonUpgradeId, number>;
  instruments: Record<InstrumentId, {
    material: number;
    specialtyLevel: number;
    autoSkillLevel: number;
    bestThreat: number;
    highestClearedThreat: number;
  }>;
};

export type SurvivalRunRewards = {
  coins: number;
  bestThreat: number;
  highestClearedThreat: number;
  instrumentId: InstrumentId;
  materials: Partial<Record<MaterialId, number>>;
};

const storageKey = 'instrument-brawl:survival-progress';

function defaultProgress(): SurvivalProgress {
  return {
    version: 1,
    coins: 0,
    lifetimeCoins: 0,
    bestThreat: 0,
    selectedInstrument: 'electric-guitar',
    commonLevels: {
      attack: 0,
      range: 0,
      attackSpeed: 0,
      moveSpeed: 0,
      condition: 0,
      recovery: 0,
    },
    instruments: {
      'electric-guitar': { material: 0, specialtyLevel: 0, autoSkillLevel: 0, bestThreat: 0, highestClearedThreat: 0 },
      bass: { material: 0, specialtyLevel: 0, autoSkillLevel: 0, bestThreat: 0, highestClearedThreat: 0 },
      'drum-sticks': { material: 0, specialtyLevel: 0, autoSkillLevel: 0, bestThreat: 0, highestClearedThreat: 0 },
      keyboard: { material: 0, specialtyLevel: 0, autoSkillLevel: 0, bestThreat: 0, highestClearedThreat: 0 },
    },
  };
}

function safeLevel(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function sanitizeProgress(value: unknown): SurvivalProgress {
  const result = defaultProgress();
  if (!value || typeof value !== 'object') return result;
  const candidate = value as Record<string, unknown>;
  result.coins = safeLevel(candidate.coins);
  result.lifetimeCoins = safeLevel(candidate.lifetimeCoins);
  result.bestThreat = safeLevel(candidate.bestThreat);
  if (typeof candidate.selectedInstrument === 'string' && instrumentById.has(candidate.selectedInstrument as InstrumentId)) {
    result.selectedInstrument = candidate.selectedInstrument as InstrumentId;
  }

  if (candidate.commonLevels && typeof candidate.commonLevels === 'object') {
    const levels = candidate.commonLevels as Record<string, unknown>;
    for (const definition of commonUpgradeDefinitions) result.commonLevels[definition.id] = safeLevel(levels[definition.id]);
  }

  if (candidate.instruments && typeof candidate.instruments === 'object') {
    const instruments = candidate.instruments as Record<string, unknown>;
    for (const definition of instrumentDefinitions) {
      const stored = instruments[definition.id];
      if (!stored || typeof stored !== 'object') continue;
      const entry = stored as Record<string, unknown>;
      result.instruments[definition.id] = {
        material: safeLevel(entry.material),
        specialtyLevel: safeLevel(entry.specialtyLevel),
        autoSkillLevel: safeLevel(entry.autoSkillLevel),
        bestThreat: safeLevel(entry.bestThreat),
        highestClearedThreat: safeLevel(entry.highestClearedThreat),
      };
    }
  }
  return result;
}

export function loadSurvivalProgress(): SurvivalProgress {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? sanitizeProgress(JSON.parse(raw)) : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

export function saveSurvivalProgress(progress: SurvivalProgress): SurvivalProgress {
  const sanitized = sanitizeProgress(progress);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(sanitized));
  } catch {
    // Progress persistence failure must not make the game unplayable.
  }
  return sanitized;
}

export function setSelectedInstrument(instrumentId: InstrumentId) {
  const progress = loadSurvivalProgress();
  progress.selectedInstrument = instrumentId;
  return saveSurvivalProgress(progress);
}

export function getCommonUpgradeCost(id: CommonUpgradeId, level: number) {
  const definition = commonUpgradeDefinitions.find((item) => item.id === id);
  return Math.round((definition?.baseCost ?? 50) * Math.pow(1.48, level));
}

export function getSpecialtyCost(level: number) {
  return { coins: Math.round(90 * Math.pow(1.55, level)), materials: 2 + level * 2 };
}

export function getAutoSkillCost(level: number) {
  return { coins: Math.round(120 * Math.pow(1.58, level)), materials: 3 + level * 3 };
}

export function buyCommonUpgrade(id: CommonUpgradeId): { progress: SurvivalProgress; purchased: boolean } {
  const progress = loadSurvivalProgress();
  const cost = getCommonUpgradeCost(id, progress.commonLevels[id]);
  if (progress.coins < cost) return { progress, purchased: false };
  progress.coins -= cost;
  progress.commonLevels[id] += 1;
  return { progress: saveSurvivalProgress(progress), purchased: true };
}

export function buySpecialtyUpgrade(instrumentId: InstrumentId): { progress: SurvivalProgress; purchased: boolean } {
  const progress = loadSurvivalProgress();
  const instrument = progress.instruments[instrumentId];
  const cost = getSpecialtyCost(instrument.specialtyLevel);
  if (progress.coins < cost.coins || instrument.material < cost.materials) return { progress, purchased: false };
  progress.coins -= cost.coins;
  instrument.material -= cost.materials;
  instrument.specialtyLevel += 1;
  return { progress: saveSurvivalProgress(progress), purchased: true };
}

export function buyAutoSkillUpgrade(instrumentId: InstrumentId): { progress: SurvivalProgress; purchased: boolean } {
  const progress = loadSurvivalProgress();
  const instrument = progress.instruments[instrumentId];
  const cost = getAutoSkillCost(instrument.autoSkillLevel);
  if (progress.coins < cost.coins || instrument.material < cost.materials) {
    return { progress, purchased: false };
  }
  progress.coins -= cost.coins;
  instrument.material -= cost.materials;
  instrument.autoSkillLevel += 1;
  return { progress: saveSurvivalProgress(progress), purchased: true };
}

export function bankRunRewards(rewards: SurvivalRunRewards) {
  const progress = loadSurvivalProgress();
  progress.coins += Math.max(0, Math.floor(rewards.coins));
  progress.lifetimeCoins += Math.max(0, Math.floor(rewards.coins));
  progress.bestThreat = Math.max(progress.bestThreat, rewards.bestThreat);
  const instrumentProgress = progress.instruments[rewards.instrumentId];
  instrumentProgress.bestThreat = Math.max(instrumentProgress.bestThreat, rewards.bestThreat);
  instrumentProgress.highestClearedThreat = Math.max(
    instrumentProgress.highestClearedThreat,
    rewards.highestClearedThreat,
  );
  const materialId = instrumentById.get(rewards.instrumentId)?.materialId;
  if (materialId) instrumentProgress.material += Math.max(0, Math.floor(rewards.materials[materialId] ?? 0));
  return saveSurvivalProgress(progress);
}

export function getTotalLevel(progress: SurvivalProgress) {
  const commonTotal = commonUpgradeDefinitions.reduce((sum, definition) => sum + progress.commonLevels[definition.id], 0);
  const specialtyTotal = instrumentDefinitions.reduce(
    (sum, definition) => sum
      + progress.instruments[definition.id].specialtyLevel
      + progress.instruments[definition.id].autoSkillLevel,
    0,
  );
  return commonTotal + specialtyTotal;
}

export function getThreatUnlockForTotalLevel(totalLevel: number) {
  let unlocked = Math.min(50, 4 + Math.floor(Math.max(0, totalLevel) / 2) * 2);
  // An unlock band should normally include the space immediately after a boss,
  // so a player is not left repeating that boss forever at the current cap.
  if (unlocked < 50 && unlocked % 5 === 0) unlocked += 1;
  return unlocked;
}

export function getInstrumentPowerLevel(progress: SurvivalProgress, instrumentId: InstrumentId) {
  const commonTotal = commonUpgradeDefinitions.reduce(
    (sum, definition) => sum + progress.commonLevels[definition.id],
    0,
  );
  return commonTotal
    + progress.instruments[instrumentId].specialtyLevel
    + progress.instruments[instrumentId].autoSkillLevel;
}

export function getInstrumentThreatCap(progress: SurvivalProgress, instrumentId: InstrumentId) {
  return getThreatUnlockForTotalLevel(getInstrumentPowerLevel(progress, instrumentId));
}

export function getRecommendedStartingThreat(totalLevel: number, maxThreat = getThreatUnlockForTotalLevel(totalLevel)) {
  if (totalLevel < 8) return 1;
  let start = Math.max(1, Math.floor(maxThreat * 0.38));
  // Never drop a newly strengthened player directly into a boss level.
  if (start % 5 === 0) start = Math.max(1, start - 1);
  return start;
}

export function getInstrumentStartingThreat(progress: SurvivalProgress, instrumentId: InstrumentId) {
  const powerLevel = getInstrumentPowerLevel(progress, instrumentId);
  const maxThreat = getInstrumentThreatCap(progress, instrumentId);
  const powerBasedStart = getRecommendedStartingThreat(powerLevel, maxThreat);
  const nextUnclearedThreat = progress.instruments[instrumentId].highestClearedThreat + 1;
  let start = Math.min(powerBasedStart, nextUnclearedThreat);
  if (start % 5 === 0) start = Math.max(1, start - 1);
  return Math.max(1, start);
}

export function isSpecialBattleUnlocked(progress: SurvivalProgress) {
  return getTotalLevel(progress) >= 3;
}
