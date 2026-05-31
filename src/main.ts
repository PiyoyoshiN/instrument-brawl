import Phaser from 'phaser';

const gameWidth = 800;
const gameHeight = 600;
const uiSafeMargin = 40;
const uiPanelOuterMargin = uiSafeMargin * 2;
const uiPanelHorizontalPadding = 48;
const uiPanelContentInset = uiPanelHorizontalPadding * 2;
const uiFooterPrimaryOffset = 28;
const uiFooterSecondaryOffset = 60;

type LayoutSafeArea = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

function getInitialLayoutWidth() {
  return Math.max(gameWidth, window.innerWidth);
}

function getInitialLayoutHeight() {
  return Math.max(gameHeight, window.innerHeight);
}

function getLayoutWidth(scene: Phaser.Scene) {
  return Math.max(gameWidth, scene.scale.width);
}

function getLayoutHeight(scene: Phaser.Scene) {
  return Math.max(gameHeight, scene.scale.height);
}

function getLayoutCenterX(scene: Phaser.Scene) {
  return scene.cameras.main.worldView.centerX;
}

function getLayoutCenterY(scene: Phaser.Scene) {
  return scene.cameras.main.worldView.centerY;
}

function getSafeArea(scene: Phaser.Scene, margin = uiSafeMargin): LayoutSafeArea {
  const width = getLayoutWidth(scene);
  const height = getLayoutHeight(scene);
  const centerX = getLayoutCenterX(scene);
  const centerY = getLayoutCenterY(scene);
  const left = centerX - width / 2 + margin;
  const right = centerX + width / 2 - margin;
  const top = centerY - height / 2 + margin;
  const bottom = centerY + height / 2 - margin;

  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    centerX,
    centerY,
  };
}

function applyViewportLayout(scene: Phaser.Scene, backgroundColor = 0x111827) {
  const layoutWidth = getLayoutWidth(scene);
  const layoutHeight = getLayoutHeight(scene);
  const scrollX = (gameWidth - layoutWidth) / 2;
  const scrollY = (gameHeight - layoutHeight) / 2;

  scene.cameras.main.setBackgroundColor(backgroundColor);
  scene.cameras.main.setScroll(scrollX, scrollY);
}

function addViewportBackground(scene: Phaser.Scene, color = 0x111827) {
  applyViewportLayout(scene, color);

  const safeArea = getSafeArea(scene, 0);
  const background = scene.add.rectangle(safeArea.centerX, safeArea.centerY, getLayoutWidth(scene), getLayoutHeight(scene), color);
  const resizeHandler = () => {
    applyViewportLayout(scene, color);
    const nextSafeArea = getSafeArea(scene, 0);
    background.setPosition(nextSafeArea.centerX, nextSafeArea.centerY);
    background.setSize(getLayoutWidth(scene), getLayoutHeight(scene));
  };

  scene.scale.on('resize', resizeHandler);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.scale.off('resize', resizeHandler);
  });

  return background;
}
type AttackTiming = {
  startupMs: number;
  activeMs: number;
  recoveryMs: number;
  cooldownMs: number;
};

const defaultFighterBodyWidth = 72;
const defaultFighterBodyHeight = 120;
const player1StartX = 240;
const player2StartX = 560;
const attackStartupMs = 0;
const attackActiveMs = 180;
const attackRecoveryMs = 60;
const attackCooldownMs = 240;
const defaultAttackTiming: AttackTiming = {
  startupMs: attackStartupMs,
  activeMs: attackActiveMs,
  recoveryMs: attackRecoveryMs,
  cooldownMs: attackCooldownMs,
};
const attackTimingByFighterId: Record<string, AttackTiming> = {
  'electric-guitar': {
    startupMs: 90,
    activeMs: 100,
    recoveryMs: 560,
    cooldownMs: 750,
  },
  bass: {
    startupMs: 130,
    activeMs: 120,
    recoveryMs: 650,
    cooldownMs: 900,
  },
  'drum-sticks': {
    startupMs: 40,
    activeMs: 70,
    recoveryMs: 140,
    cooldownMs: 250,
  },
  keyboard: {
    startupMs: 120,
    activeMs: 130,
    recoveryMs: 750,
    cooldownMs: 1000,
  },
};
const knockbackDecay = 2800;
const knockbackStopSpeed = 8;
const hitFlashColor = 0xffffff;
const hitFlashDurationMs = 120;
const matchEndDelayMs = 450;
const matchStartDelayMs = 900;
const matchStartFightTextDurationMs = 450;
const hitMarkerDurationMs = 360;
const hitSparkDurationMs = 140;
const hitShakeDurationMs = 60;
const hitShakeIntensity = 0.003;
const hpBarWidth = 220;
const hpBarHeight = 18;
const hpBarInset = 3;
const cpuAttackDistancePadding = 18;
// Phase 10 Amp prototype: small reach-only bonus (no projectile, no damage increase).
const ampAttackReachBonusPx = 24;
// Phase 10 Case prototype: normal incoming damage only (no knockback/HP/guard behavior changes).
const caseNormalDamageMultiplier = 0.8;
const normalGuardDamageMultiplier = 0.5;
const normalGuardKnockbackMultiplier = 0.5;
const normalGuardMovementMultiplier = 0.65;
const justGuardWindowMs = 120;
const justGuardFeedbackDurationMs = 220;
const matchTimerDurationSeconds = 99;
// Phase 10 prototype balancing pass #1:
// Drum Sticks keeps a high-variance critical identity, tuned to 35% / 1.5x
// so expected damage stays below Electric Guitar/Bass baseline while preserving burst.
const drumSticksCriticalRate = 0.35;
const drumSticksCriticalMultiplier = 1.5;
const cpuComfortDistance = 140;
const cpuDecisionIntervalMs = 850;
const cpuRetreatDurationMs = 420;
const cpuRetreatChance = 0.22;

type Player2Mode = 'human' | 'cpu';


type EquipmentId = 'none' | 'amp' | 'pick' | 'case';

type EquipmentDefinition = {
  id: EquipmentId;
  displayName: string;
  shortLabel: string;
  description: string;
  conceptRole: string;
};

type EquipmentDisplayJa = {
  displayNameJa: string;
  shortLabelJa: string;
  descriptionJa: string;
};

const noneEquipmentDefinition: EquipmentDefinition = {
  id: 'none',
  displayName: 'No Accessory',
  shortLabel: 'None',
  description: 'No support equipment.',
  conceptRole: 'default / baseline / no support equipment',
};

const ampEquipmentDefinition: EquipmentDefinition = {
  id: 'amp',
  displayName: 'Amp',
  shortLabel: 'Amp',
  description: 'Sound projection and stage presence flavor.',
  conceptRole: 'sound projection / stage presence flavor',
};

const pickEquipmentDefinition: EquipmentDefinition = {
  id: 'pick',
  displayName: 'Pick',
  shortLabel: 'Pick',
  description: 'Sharper and more precise playing flavor.',
  conceptRole: 'sharper / precise playing flavor',
};

const caseEquipmentDefinition: EquipmentDefinition = {
  id: 'case',
  displayName: 'Case',
  shortLabel: 'Case',
  description: 'Sturdy stage gear and carrying flavor.',
  conceptRole: 'sturdy / protective stage gear flavor',
};

const equipmentDefinitions: EquipmentDefinition[] = [
  noneEquipmentDefinition,
  ampEquipmentDefinition,
  pickEquipmentDefinition,
  caseEquipmentDefinition,
];

const equipmentDefinitionById = new Map<EquipmentId, EquipmentDefinition>(
  equipmentDefinitions.map((definition) => [definition.id, definition]),
);

const equipmentDisplayJaById: Record<EquipmentId, EquipmentDisplayJa> = {
  none: {
    displayNameJa: '装備なし',
    shortLabelJa: 'なし',
    descriptionJa: '追加装備なし。素の性能で戦う。',
  },
  amp: {
    displayNameJa: 'アンプ',
    shortLabelJa: 'アンプ',
    descriptionJa: 'エレキギター・ベース・キーボード対応。攻撃の届く範囲が少し伸びる。',
  },
  pick: {
    displayNameJa: 'ピック（準備中）',
    shortLabelJa: 'ピック',
    descriptionJa: 'Phase 10では効果なし。後のフェーズで検討。',
  },
  case: {
    displayNameJa: 'ケース',
    shortLabelJa: 'ケース',
    descriptionJa: '通常ダメージを軽減する。クリティカルは軽減できない。',
  },
};

function getAllEquipmentDefinitions(): EquipmentDefinition[] {
  return [...equipmentDefinitions];
}

function isEquipmentId(value: unknown): value is EquipmentId {
  return value === 'none' || value === 'amp' || value === 'pick' || value === 'case';
}

function getEquipmentDefinition(id: unknown): EquipmentDefinition {
  if (!isEquipmentId(id)) {
    return noneEquipmentDefinition;
  }

  return equipmentDefinitionById.get(id) ?? noneEquipmentDefinition;
}

function getEquipmentDisplayNameJa(id: unknown): string {
  return equipmentDisplayJaById[getEquipmentDefinition(id).id].displayNameJa;
}

function getEquipmentShortLabelJa(id: unknown): string {
  return equipmentDisplayJaById[getEquipmentDefinition(id).id].shortLabelJa;
}

function getEquipmentDescriptionJa(id: unknown): string {
  return equipmentDisplayJaById[getEquipmentDefinition(id).id].descriptionJa;
}

function getEquipmentDisplayTextJa(id: unknown): string {
  const equipmentId = getEquipmentDefinition(id).id;
  const display = equipmentDisplayJaById[equipmentId];
  return `${display.displayNameJa} / ${display.shortLabelJa}`;
}

type FighterStats = {
  maxHp: number;
  moveSpeed: number;
  attackDamage: number;
  knockbackSpeed: number;
  attackWidth: number;
  attackHeight: number;
  attackYOffset: number;
  attackColor: number;
  attackStrokeColor: number;
};

type FighterDefinition = {
  id: string;
  displayName: string;
  role: string;
  stats: FighterStats;
  bodyWidth?: number;
  bodyHeight?: number;
  bodyColor: number;
  bodyStrokeColor: number;
  labelColor: string;
  resultWinText: string;
};

const electricGuitarDefinition: FighterDefinition = {
  id: 'electric-guitar',
  displayName: 'Electric Guitar',
  role: 'Faster standard fighter with a sharper horizontal attack hitbox',
  stats: {
    maxHp: 100,
    moveSpeed: 260,
    attackDamage: 10,
    knockbackSpeed: 520,
    attackWidth: 104,
    attackHeight: 52,
    attackYOffset: -8,
    attackColor: 0xfacc15,
    attackStrokeColor: 0xfef08a,
  },
  bodyColor: 0xf97316,
  bodyStrokeColor: 0xffedd5,
  labelColor: '#fed7aa',
  resultWinText: 'P1 Electric Guitar Wins',
};

const bassDefinition: FighterDefinition = {
  id: 'bass',
  displayName: 'Bass',
  role: 'Slower heavier fighter with a taller/heavier attack hitbox',
  stats: {
    maxHp: 105,
    moveSpeed: 230,
    attackDamage: 10,
    knockbackSpeed: 580,
    attackWidth: 88,
    attackHeight: 86,
    attackYOffset: 4,
    attackColor: 0xf59e0b,
    attackStrokeColor: 0xfef3c7,
  },
  bodyColor: 0x38bdf8,
  bodyStrokeColor: 0xe0f2fe,
  labelColor: '#bae6fd',
  resultWinText: 'P2 Bass Wins',
};

const drumSticksDefinition: FighterDefinition = {
  id: 'drum-sticks',
  displayName: 'Drum Sticks',
  role: 'Lightweight / Fast / Short reach',
  stats: {
    maxHp: 80,
    moveSpeed: 310,
    attackDamage: 8,
    knockbackSpeed: 420,
    attackWidth: 64,
    attackHeight: 44,
    attackYOffset: -4,
    attackColor: 0xfde047,
    attackStrokeColor: 0xfef9c3,
  },
  bodyColor: 0xd97706,
  bodyStrokeColor: 0xfef3c7,
  labelColor: '#fde68a',
  resultWinText: 'Drum Sticks Wins',
};

const keyboardDefinition: FighterDefinition = {
  id: 'keyboard',
  displayName: 'Keyboard',
  role: 'Wide / Awkward / Area control',
  stats: {
    maxHp: 95,
    moveSpeed: 215,
    attackDamage: 9,
    knockbackSpeed: 500,
    attackWidth: 118,
    attackHeight: 46,
    attackYOffset: 0,
    attackColor: 0xa78bfa,
    attackStrokeColor: 0xede9fe,
  },
  bodyWidth: 112,
  bodyHeight: 70,
  bodyColor: 0x4c1d95,
  bodyStrokeColor: 0xddd6fe,
  labelColor: '#ddd6fe',
  resultWinText: 'Keyboard Wins',
};

const fighterDefinitions = [electricGuitarDefinition, bassDefinition, drumSticksDefinition, keyboardDefinition];
const fighterDefinitionById = new Map(fighterDefinitions.map((definition) => [definition.id, definition]));

const fighterDisplayNameJaById: Record<string, { displayNameJa: string; shortLabelJa: string }> = {
  'electric-guitar': { displayNameJa: 'エレキギター', shortLabelJa: 'エレキ' },
  bass: { displayNameJa: 'ベース', shortLabelJa: 'ベース' },
  'drum-sticks': { displayNameJa: 'ドラムスティック', shortLabelJa: 'ドラム' },
  keyboard: { displayNameJa: 'キーボード', shortLabelJa: 'キーボード' },
};

const fighterDescriptionJaById: Record<string, string> = {
  'electric-guitar': '標準的で扱いやすい。横に強い攻撃。',
  bass: '重めでふっとばしが強い。縦に広い攻撃。',
  'drum-sticks': '素早い短射程。高クリティカル。ケース装備時は高クリティカルなし。',
  keyboard: '広い攻撃範囲で場を取りやすい。',
};

function getFighterDisplayNameJa(id: string): string {
  return fighterDisplayNameJaById[id]?.displayNameJa ?? getFighterDefinition(id).displayName;
}

function getFighterShortLabelJa(id: string): string {
  return fighterDisplayNameJaById[id]?.shortLabelJa ?? getFighterDefinition(id).displayName;
}

function getFighterDescriptionJa(id: string): string {
  return fighterDescriptionJaById[id] ?? getFighterDefinition(id).role;
}

function getCriticalHitLabelJa(): string {
  return 'クリティカル！';
}

function getFighterDefinition(id: string) {
  const definition = fighterDefinitionById.get(id);

  if (!definition) {
    throw new Error(`Unknown fighter definition: ${id}`);
  }

  return definition;
}

const defaultPlayer1FighterId = 'electric-guitar';
const defaultPlayer2FighterId = 'bass';
const defaultPlayer1FighterDefinition = getFighterDefinition(defaultPlayer1FighterId);
const defaultPlayer2FighterDefinition = getFighterDefinition(defaultPlayer2FighterId);
const defaultPlayer2Mode: Player2Mode = 'human';
const settingsStorageKey = 'instrument-brawl:settings';
const settingsVersion = 1;

type StoredSettings = {
  version: number;
  lastSelected: {
    player1FighterId: string;
    player2FighterId: string;
    player2Mode: Player2Mode;
    player1EquipmentId: EquipmentId;
    player2EquipmentId: EquipmentId;
  };
  preferences: {
    effectsEnabled: boolean;
    screenShakeEnabled: boolean;
  };
};

const defaultStoredSettings: StoredSettings = {
  version: settingsVersion,
  lastSelected: {
    player1FighterId: defaultPlayer1FighterId,
    player2FighterId: defaultPlayer2FighterId,
    player2Mode: defaultPlayer2Mode,
    player1EquipmentId: 'none',
    player2EquipmentId: 'none',
  },
  preferences: {
    effectsEnabled: true,
    screenShakeEnabled: true,
  },
};

function sanitizeStoredSettings(value: unknown): StoredSettings {
  const base: StoredSettings = {
    version: settingsVersion,
    lastSelected: {
      player1FighterId: defaultPlayer1FighterId,
      player2FighterId: defaultPlayer2FighterId,
      player2Mode: defaultPlayer2Mode,
      player1EquipmentId: 'none',
      player2EquipmentId: 'none',
    },
    preferences: {
      effectsEnabled: true,
      screenShakeEnabled: true,
    },
  };

  if (!value || typeof value !== 'object') {
    return base;
  }

  const candidate = value as Partial<StoredSettings> & Record<string, unknown>;
  const lastSelected = candidate.lastSelected;
  const preferences = candidate.preferences;

  const player1Candidate =
    lastSelected && typeof lastSelected === 'object'
      ? (lastSelected as Record<string, unknown>).player1FighterId
      : undefined;
  if (typeof player1Candidate === 'string' && fighterDefinitionById.has(player1Candidate)) {
    base.lastSelected.player1FighterId = player1Candidate;
  }

  const player2Candidate =
    lastSelected && typeof lastSelected === 'object'
      ? (lastSelected as Record<string, unknown>).player2FighterId
      : undefined;
  if (typeof player2Candidate === 'string' && fighterDefinitionById.has(player2Candidate)) {
    base.lastSelected.player2FighterId = player2Candidate;
  }

  const modeCandidate =
    lastSelected && typeof lastSelected === 'object'
      ? (lastSelected as Record<string, unknown>).player2Mode
      : undefined;
  if (modeCandidate === 'human' || modeCandidate === 'cpu') {
    base.lastSelected.player2Mode = modeCandidate;
  }

  const player1EquipmentCandidate =
    lastSelected && typeof lastSelected === 'object'
      ? (lastSelected as Record<string, unknown>).player1EquipmentId
      : undefined;
  base.lastSelected.player1EquipmentId = getEquipmentDefinition(player1EquipmentCandidate).id;

  const player2EquipmentCandidate =
    lastSelected && typeof lastSelected === 'object'
      ? (lastSelected as Record<string, unknown>).player2EquipmentId
      : undefined;
  base.lastSelected.player2EquipmentId = getEquipmentDefinition(player2EquipmentCandidate).id;

  const effectsEnabledCandidate =
    preferences && typeof preferences === 'object'
      ? (preferences as Record<string, unknown>).effectsEnabled
      : undefined;
  if (typeof effectsEnabledCandidate === 'boolean') {
    base.preferences.effectsEnabled = effectsEnabledCandidate;
  }

  const screenShakeEnabledCandidate =
    preferences && typeof preferences === 'object'
      ? (preferences as Record<string, unknown>).screenShakeEnabled
      : undefined;
  if (typeof screenShakeEnabledCandidate === 'boolean') {
    base.preferences.screenShakeEnabled = screenShakeEnabledCandidate;
  }

  return base;
}

function loadStoredSettings(): StoredSettings {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...defaultStoredSettings, lastSelected: { ...defaultStoredSettings.lastSelected }, preferences: { ...defaultStoredSettings.preferences } };
    }

    const raw = window.localStorage.getItem(settingsStorageKey);

    if (!raw) {
      return { ...defaultStoredSettings, lastSelected: { ...defaultStoredSettings.lastSelected }, preferences: { ...defaultStoredSettings.preferences } };
    }

    return sanitizeStoredSettings(JSON.parse(raw));
  } catch {
    return { ...defaultStoredSettings, lastSelected: { ...defaultStoredSettings.lastSelected }, preferences: { ...defaultStoredSettings.preferences } };
  }
}

function saveStoredSettings(settings: StoredSettings): StoredSettings {
  const sanitized = sanitizeStoredSettings(settings);

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return sanitized;
    }

    window.localStorage.setItem(settingsStorageKey, JSON.stringify(sanitized));
  } catch {
    return sanitized;
  }

  return sanitized;
}

function saveLastSelected(partialLastSelected: Partial<StoredSettings['lastSelected']>) {
  try {
    const current = loadStoredSettings();

    saveStoredSettings({
      ...current,
      lastSelected: {
        ...current.lastSelected,
        ...partialLastSelected,
      },
      preferences: {
        ...current.preferences,
      },
    });
  } catch {
    // keep runtime behavior unchanged when storage is unavailable/fails
  }
}

function savePreferences(partialPreferences: Partial<StoredSettings['preferences']>) {
  try {
    const current = loadStoredSettings();

    saveStoredSettings({
      ...current,
      lastSelected: {
        ...current.lastSelected,
      },
      preferences: {
        ...current.preferences,
        ...partialPreferences,
      },
    });
  } catch {
    // keep runtime behavior unchanged when storage is unavailable/fails
  }
}


const recordsStorageKey = 'instrument-brawl:records';
const recordsVersion = 1;

type StoredRecords = {
  version: number;
  totalMatches: number;
  p1Wins: number;
  p2Wins: number;
  draws: number;
  cpuMatches: number;
  local2pMatches: number;
  lastPlayedAt: string | null;
};

const defaultStoredRecords: StoredRecords = {
  version: recordsVersion,
  totalMatches: 0,
  p1Wins: 0,
  p2Wins: 0,
  draws: 0,
  cpuMatches: 0,
  local2pMatches: 0,
  lastPlayedAt: null,
};

function getDefaultStoredRecords(): StoredRecords {
  return {
    ...defaultStoredRecords,
  };
}

function sanitizeStoredRecords(value: unknown): StoredRecords {
  const base = getDefaultStoredRecords();

  if (!value || typeof value !== 'object') {
    return base;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.version !== recordsVersion) {
    return base;
  }

  const sanitizeCounter = (field: keyof Omit<StoredRecords, 'version' | 'lastPlayedAt'>) => {
    const raw = candidate[field];

    if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 0) {
      return 0;
    }

    return Math.floor(raw);
  };

  base.totalMatches = sanitizeCounter('totalMatches');
  base.p1Wins = sanitizeCounter('p1Wins');
  base.p2Wins = sanitizeCounter('p2Wins');
  base.draws = sanitizeCounter('draws');
  base.cpuMatches = sanitizeCounter('cpuMatches');
  base.local2pMatches = sanitizeCounter('local2pMatches');

  const lastPlayedAtCandidate = candidate.lastPlayedAt;
  if (lastPlayedAtCandidate === null || typeof lastPlayedAtCandidate === 'string') {
    base.lastPlayedAt = lastPlayedAtCandidate;
  }

  return base;
}

function loadStoredRecords(): StoredRecords {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return getDefaultStoredRecords();
    }

    const raw = window.localStorage.getItem(recordsStorageKey);

    if (!raw) {
      return getDefaultStoredRecords();
    }

    return sanitizeStoredRecords(JSON.parse(raw));
  } catch {
    return getDefaultStoredRecords();
  }
}

function saveStoredRecords(records: StoredRecords): StoredRecords {
  const sanitized = sanitizeStoredRecords(records);

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return sanitized;
    }

    window.localStorage.setItem(recordsStorageKey, JSON.stringify(sanitized));
  } catch {
    return sanitized;
  }

  return sanitized;
}

function recordStoredMatchResult(result: 'p1' | 'p2' | 'draw', player2Mode: Player2Mode): StoredRecords {
  try {
    const current = loadStoredRecords();
    const next: StoredRecords = {
      ...current,
      totalMatches: current.totalMatches + 1,
      p1Wins: current.p1Wins + (result === 'p1' ? 1 : 0),
      p2Wins: current.p2Wins + (result === 'p2' ? 1 : 0),
      draws: current.draws + (result === 'draw' ? 1 : 0),
      cpuMatches: current.cpuMatches + (player2Mode === 'cpu' ? 1 : 0),
      local2pMatches: current.local2pMatches + (player2Mode === 'human' ? 1 : 0),
      lastPlayedAt: new Date().toISOString(),
    };

    return saveStoredRecords(next);
  } catch {
    return loadStoredRecords();
  }
}

function resetStoredRecords(): StoredRecords {
  try {
    return saveStoredRecords(getDefaultStoredRecords());
  } catch {
    return getDefaultStoredRecords();
  }
}

function resetStoredSettings(): StoredSettings {
  try {
    return saveStoredSettings({
      ...defaultStoredSettings,
      lastSelected: {
        ...defaultStoredSettings.lastSelected,
      },
      preferences: {
        ...defaultStoredSettings.preferences,
      },
    });
  } catch {
    return {
      ...defaultStoredSettings,
      lastSelected: {
        ...defaultStoredSettings.lastSelected,
      },
      preferences: {
        ...defaultStoredSettings.preferences,
      },
    };
  }
}

type Fighter = {
  body: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  facing: -1 | 1;
  nextAttackAt: number;
  knockbackVelocity: number;
  isGuarding: boolean;
  guardStartedAt: number;
  normalColor: number;
  stats: FighterStats;
  definition: FighterDefinition;
  hitFlashEvent?: Phaser.Time.TimerEvent;
  guardIndicator?: Phaser.GameObjects.Ellipse;
};

type PlayerControls = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  attacks: Phaser.Input.Keyboard.Key[];
  guardKey: Phaser.Input.Keyboard.Key;
};

type PlayerHp = {
  name: string;
  current: number;
  max: number;
  text: Phaser.GameObjects.Text;
  barBackground: Phaser.GameObjects.Rectangle;
  barFill: Phaser.GameObjects.Rectangle;
  barMaxWidth: number;
};

type PendingAttack = {
  attacker: Fighter;
  defender: Fighter;
  defenderHp: PlayerHp;
  timing: AttackTiming;
  activeStartsAt: number;
};

type ActiveAttack = {
  attacker: Fighter;
  defender: Fighter;
  defenderHp: PlayerHp;
  hitbox: Phaser.GameObjects.Rectangle;
  hasHit: boolean;
  activeStartedAt: number;
  expiresAt: number;
};

type DamageCalculationResult = {
  damage: number;
  isCritical: boolean;
  wasJustGuarded: boolean;
};
type BattleSceneData = {
  player1FighterId?: string;
  player2FighterId?: string;
  player2Mode?: Player2Mode;
  player1EquipmentId?: EquipmentId;
  player2EquipmentId?: EquipmentId;
};

type CharacterSelectSceneData = BattleSceneData;

type MatchEndReason = 'ko' | 'time_up' | 'retire' | 'draw';
type RetirePlayer = 'p1' | 'p2';

type ResultSceneData = BattleSceneData & {
  result?: 'p1' | 'p2' | 'draw';
  displayTitle?: string;
  // Transient ResultScene display only; records continue to use result counters.
  matchEndReason?: MatchEndReason;
};

type AttackVisualStyle = {
  fillColor: number;
  strokeColor: number;
};

const attackVisualPaletteByFighterId: Record<string, AttackVisualStyle[]> = {
  'electric-guitar': [
    { fillColor: 0xfacc15, strokeColor: 0xfef08a },
    { fillColor: 0xf59e0b, strokeColor: 0xfcd34d },
    { fillColor: 0xfef3c7, strokeColor: 0xfffbeb },
  ],
  bass: [
    { fillColor: 0x0ea5e9, strokeColor: 0xbae6fd },
    { fillColor: 0x06b6d4, strokeColor: 0xcffafe },
    { fillColor: 0x1e3a8a, strokeColor: 0x93c5fd },
  ],
  'drum-sticks': [
    { fillColor: 0xfde047, strokeColor: 0xfef9c3 },
    { fillColor: 0xfef3c7, strokeColor: 0xfffbeb },
    { fillColor: 0xfbbf24, strokeColor: 0xfde68a },
  ],
  keyboard: [
    { fillColor: 0xa78bfa, strokeColor: 0xede9fe },
    { fillColor: 0xc4b5fd, strokeColor: 0xe9d5ff },
    { fillColor: 0x7c3aed, strokeColor: 0xc4b5fd },
  ],
};


class HomeScene extends Phaser.Scene {
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private selectedIndex = 0;
  private startCard?: Phaser.GameObjects.Rectangle;
  private recordsCard?: Phaser.GameObjects.Rectangle;
  private optionsCard?: Phaser.GameObjects.Rectangle;
  private inputEnabledAt = 0;
  private transitionStarted = false;

  constructor() {
    super('HomeScene');
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;

    addViewportBackground(this);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const centerX = camera.scrollX + layoutWidth / 2;
    const centerY = camera.scrollY + layoutHeight / 2;
    const safeTop = camera.scrollY + uiSafeMargin;
    const safeBottom = camera.scrollY + layoutHeight - uiSafeMargin;
    const panelWidth = Math.min(760, layoutWidth - uiPanelOuterMargin);
    const cardGap = 24;
    const cardWidth = Math.min(210, (panelWidth - uiPanelContentInset - cardGap * 2) / 3);
    const cardY = safeTop + 392;
    const firstCardX = centerX - cardWidth - cardGap;

    this.add.rectangle(centerX, centerY, panelWidth, Math.min(460, layoutHeight - uiPanelOuterMargin), 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(centerX, safeTop + 68, 'Instrument Brawl', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '48px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeTop + 126, 'ふたり対戦 / CPU戦の楽器バトル', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeTop + 166, '4キャラ • ローカル対戦 • CPU戦', {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add.rectangle(centerX, safeTop + 244, panelWidth - uiPanelContentInset, 82, 0x0f172a, 0.72).setStrokeStyle(2, 0x334155);
    this.add
      .text(
        centerX,
        safeTop + 244,
        [`P1 ${getFighterDisplayNameJa(defaultPlayer1FighterId)}: A/D移動・W/Space攻撃`, `P2 ${getFighterDisplayNameJa(defaultPlayer2FighterId)}: ←/→移動・↑/Enter攻撃`],
        {
          align: 'center',
          color: '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '19px',
          lineSpacing: 8,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(centerX, safeTop + 330, '←/→/↑/↓: 選択', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.startCard = this.add.rectangle(firstCardX, cardY, cardWidth, 76, 0x0f172a).setStrokeStyle(4, 0xfacc15);
    this.recordsCard = this.add.rectangle(centerX, cardY, cardWidth, 76, 0x0f172a).setStrokeStyle(3, 0x475569);
    this.optionsCard = this.add.rectangle(centerX + cardWidth + cardGap, cardY, cardWidth, 76, 0x0f172a).setStrokeStyle(3, 0x475569);
    this.add
      .text(firstCardX, cardY, 'はじめる', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);
    this.add
      .text(centerX, cardY, '記録', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);
    this.add
      .text(centerX + cardWidth + cardGap, cardY, '設定', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeBottom - uiFooterPrimaryOffset, 'Enter/Space: 決定', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    this.updateSelectionVisuals();

    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) {
      return;
    }

    if (
      (this.leftKey && Phaser.Input.Keyboard.JustDown(this.leftKey)) ||
      (this.upKey && Phaser.Input.Keyboard.JustDown(this.upKey))
    ) {
      this.selectedIndex = (this.selectedIndex + 2) % 3;
      this.updateSelectionVisuals();
    }

    if (
      (this.rightKey && Phaser.Input.Keyboard.JustDown(this.rightKey)) ||
      (this.downKey && Phaser.Input.Keyboard.JustDown(this.downKey))
    ) {
      this.selectedIndex = (this.selectedIndex + 1) % 3;
      this.updateSelectionVisuals();
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      this.transitionStarted = true;
      this.scene.start(this.selectedIndex === 0 ? 'ModeSelectScene' : this.selectedIndex === 1 ? 'RecordsScene' : 'OptionsScene');
    }
  }

  private updateSelectionVisuals() {
    const startSelected = this.selectedIndex === 0;
    const recordsSelected = this.selectedIndex === 1;
    const optionsSelected = this.selectedIndex === 2;
    this.startCard?.setStrokeStyle(startSelected ? 4 : 3, startSelected ? 0xfacc15 : 0x475569);
    this.recordsCard?.setStrokeStyle(recordsSelected ? 4 : 3, recordsSelected ? 0xfacc15 : 0x475569);
    this.optionsCard?.setStrokeStyle(optionsSelected ? 4 : 3, optionsSelected ? 0xfacc15 : 0x475569);
  }
}

class OptionsScene extends Phaser.Scene {
  private selectedIndex = 0;
  private effectsEnabled = true;
  private screenShakeEnabled = true;
  private isResetArmed = false;
  private effectsText?: Phaser.GameObjects.Text;
  private screenShakeText?: Phaser.GameObjects.Text;
  private resetPreferencesText?: Phaser.GameObjects.Text;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;
  private inputEnabledAt = 0;
  private transitionStarted = false;

  constructor() {
    super('OptionsScene');
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;
    this.selectedIndex = 0;
    this.isResetArmed = false;
    const stored = loadStoredSettings();
    this.effectsEnabled = stored.preferences.effectsEnabled;
    this.screenShakeEnabled = stored.preferences.screenShakeEnabled;

    addViewportBackground(this);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const centerX = camera.scrollX + layoutWidth / 2;
    const centerY = camera.scrollY + layoutHeight / 2;
    const safeTop = camera.scrollY + uiSafeMargin;
    const safeBottom = camera.scrollY + layoutHeight - uiSafeMargin;
    const panelWidth = Math.min(700, layoutWidth - uiPanelOuterMargin);
    const rowWidth = panelWidth - uiPanelContentInset;
    const rowLeft = centerX - rowWidth / 2;
    const rowYs = [safeTop + 198, safeTop + 278, safeTop + 358];

    this.add.rectangle(centerX, centerY, panelWidth, Math.min(460, layoutHeight - uiPanelOuterMargin), 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add.text(centerX, safeTop + 52, '設定', { color: '#ffffff', fontFamily: 'system-ui, sans-serif', fontSize: '44px' }).setOrigin(0.5);
    this.add.text(centerX, safeTop + 96, 'ローカル設定', { color: '#cbd5e1', fontFamily: 'system-ui, sans-serif', fontSize: '22px' }).setOrigin(0.5);

    for (const rowY of rowYs) {
      this.add.rectangle(centerX, rowY, rowWidth, 64, 0x0f172a, 0.78).setStrokeStyle(2, 0x334155);
    }

    this.effectsText = this.add.text(rowLeft + 24, rowYs[0] - 12, '', { color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '26px' }).setOrigin(0, 0.5);
    this.add.text(rowLeft + 24, rowYs[0] + 18, 'ヒット演出などの表示', { color: '#94a3b8', fontFamily: 'system-ui, sans-serif', fontSize: '16px' }).setOrigin(0, 0.5);

    this.screenShakeText = this.add.text(rowLeft + 24, rowYs[1] - 12, '', { color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '26px' }).setOrigin(0, 0.5);
    this.add.text(rowLeft + 24, rowYs[1] + 18, 'ヒット時の小さな画面揺れ', { color: '#94a3b8', fontFamily: 'system-ui, sans-serif', fontSize: '16px' }).setOrigin(0, 0.5);

    this.resetPreferencesText = this.add.text(rowLeft + 24, rowYs[2] - 4, '', { color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '26px' }).setOrigin(0, 0.5);

    this.add.text(centerX, safeBottom - uiFooterSecondaryOffset, '↑/↓: 選択   ←/→・Enter/Space: 切替/決定', { color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', fontSize: '18px' }).setOrigin(0.5);
    this.add.text(centerX, safeBottom - uiFooterPrimaryOffset, 'Esc: ホームへ戻る', { color: '#facc15', fontFamily: 'system-ui, sans-serif', fontSize: '22px' }).setOrigin(0.5);

    this.updateTexts();

    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) return;

    if ((this.upKey && Phaser.Input.Keyboard.JustDown(this.upKey)) || (this.downKey && Phaser.Input.Keyboard.JustDown(this.downKey))) {
      const previousIndex = this.selectedIndex;
      this.selectedIndex = (this.selectedIndex + 1) % 3;

      if (previousIndex === 2 || this.selectedIndex !== 2) {
        this.isResetArmed = false;
      }

      this.updateTexts();
    }

    if (
      (this.leftKey && Phaser.Input.Keyboard.JustDown(this.leftKey)) ||
      (this.rightKey && Phaser.Input.Keyboard.JustDown(this.rightKey)) ||
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      if (this.selectedIndex === 0) {
        this.isResetArmed = false;
        this.effectsEnabled = !this.effectsEnabled;
        savePreferences({ effectsEnabled: this.effectsEnabled });
      } else if (this.selectedIndex === 1) {
        this.isResetArmed = false;
        this.screenShakeEnabled = !this.screenShakeEnabled;
        savePreferences({ screenShakeEnabled: this.screenShakeEnabled });
      } else if (!this.isResetArmed) {
        this.isResetArmed = true;
      } else {
        const reset = resetStoredSettings();
        this.effectsEnabled = reset.preferences.effectsEnabled;
        this.screenShakeEnabled = reset.preferences.screenShakeEnabled;
        this.isResetArmed = false;
      }
      this.updateTexts();
    }

    if (this.escapeKey && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.transitionStarted = true;
      this.scene.start('HomeScene');
    }
  }

  private updateTexts() {
    const prefixA = this.selectedIndex === 0 ? '▶ ' : '  ';
    const prefixB = this.selectedIndex === 1 ? '▶ ' : '  ';
    const prefixC = this.selectedIndex === 2 ? '▶ ' : '  ';
    const resetText = this.isResetArmed ? '設定リセット（確認中: もう一度押すと実行）' : '設定リセット';
    this.effectsText?.setText(`${prefixA}演出: ${this.effectsEnabled ? 'ON' : 'OFF'}`);
    this.screenShakeText?.setText(`${prefixB}画面揺れ: ${this.screenShakeEnabled ? 'ON' : 'OFF'}`);
    this.resetPreferencesText?.setText(`${prefixC}${resetText}`);
  }
}

class ModeSelectScene extends Phaser.Scene {
  private mode: Player2Mode = 'human';
  private local2pButton?: Phaser.GameObjects.Rectangle;
  private cpuButton?: Phaser.GameObjects.Rectangle;
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;
  private inputEnabledAt = 0;
  private transitionStarted = false;

  constructor() {
    super('ModeSelectScene');
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;
    this.mode = loadStoredSettings().lastSelected.player2Mode;

    addViewportBackground(this);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const centerX = camera.scrollX + layoutWidth / 2;
    const centerY = camera.scrollY + layoutHeight / 2;
    const safeTop = camera.scrollY + uiSafeMargin;
    const safeBottom = camera.scrollY + layoutHeight - uiSafeMargin;
    const panelWidth = Math.min(740, layoutWidth - uiPanelOuterMargin);
    const buttonGap = 32;
    const buttonWidth = Math.min(320, (panelWidth - uiPanelContentInset - buttonGap) / 2);
    const buttonHeight = 160;
    const buttonY = safeTop + 292;
    const local2pX = centerX - buttonWidth / 2 - buttonGap / 2;
    const cpuX = centerX + buttonWidth / 2 + buttonGap / 2;

    this.add.rectangle(centerX, centerY, panelWidth, Math.min(460, layoutHeight - uiPanelOuterMargin), 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(centerX, safeTop + 64, '対戦モード選択', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeTop + 112, '遊び方を選んでキャラ選択へ進みます', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.local2pButton = this.add.rectangle(local2pX, buttonY, buttonWidth, buttonHeight, 0x0f172a).setStrokeStyle(4, 0xfacc15);
    this.cpuButton = this.add.rectangle(cpuX, buttonY, buttonWidth, buttonHeight, 0x0f172a).setStrokeStyle(3, 0x475569);

    this.add
      .text(local2pX, buttonY - 28, 'ふたりで対戦', {
        align: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '34px',
      })
      .setOrigin(0.5);

    this.add
      .text(local2pX, buttonY + 30, ['ローカル2P', 'P1/P2を人が操作'], {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '19px',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(cpuX, buttonY - 28, 'CPU戦', {
        align: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '34px',
      })
      .setOrigin(0.5);

    this.add
      .text(cpuX, buttonY + 30, ['P1 vs CPU', 'P2は自動操作'], {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '19px',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeBottom - uiFooterSecondaryOffset, '↑/↓/←/→: モード選択', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '19px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeBottom - uiFooterPrimaryOffset, 'Enter/Space: 決定   Esc: ホームへ戻る', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.local2pButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.mode = 'human';
      this.confirmModeSelection();
    });
    this.cpuButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.mode = 'cpu';
      this.confirmModeSelection();
    });

    this.updateModeVisuals();

    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) {
      return;
    }

    if (
      (this.leftKey && Phaser.Input.Keyboard.JustDown(this.leftKey)) ||
      (this.upKey && Phaser.Input.Keyboard.JustDown(this.upKey)) ||
      (this.rightKey && Phaser.Input.Keyboard.JustDown(this.rightKey)) ||
      (this.downKey && Phaser.Input.Keyboard.JustDown(this.downKey))
    ) {
      this.mode = this.mode === 'human' ? 'cpu' : 'human';
      this.updateModeVisuals();
    }

    if (this.escapeKey && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.transitionStarted = true;
      this.scene.start('HomeScene');
      return;
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      this.confirmModeSelection();
    }
  }

  private updateModeVisuals() {
    const humanSelected = this.mode === 'human';

    this.local2pButton?.setStrokeStyle(humanSelected ? 4 : 3, humanSelected ? 0xfacc15 : 0x475569);
    this.cpuButton?.setStrokeStyle(humanSelected ? 3 : 4, humanSelected ? 0x475569 : 0xfacc15);
    this.local2pButton?.setFillStyle(humanSelected ? 0x1f2937 : 0x0f172a);
    this.cpuButton?.setFillStyle(humanSelected ? 0x0f172a : 0x1f2937);
  }

  private confirmModeSelection() {
    if (this.transitionStarted || this.time.now < this.inputEnabledAt) {
      return;
    }

    this.transitionStarted = true;
    saveLastSelected({
      player2Mode: this.mode,
    });
    this.scene.start('CharacterSelectScene', {
      player2Mode: this.mode,
    });
  }
}

class CharacterSelectScene extends Phaser.Scene {
  private player1FighterId = defaultPlayer1FighterId;
  private player2FighterId = defaultPlayer2FighterId;
  private player2Mode = defaultPlayer2Mode;
  private player1EquipmentId: EquipmentId = 'none';
  private player2EquipmentId: EquipmentId = 'none';
  private player1Index = 0;
  private player2Index = 0;
  private player1NameText?: Phaser.GameObjects.Text;
  private player1IndexText?: Phaser.GameObjects.Text;
  private player1RoleText?: Phaser.GameObjects.Text;
  private player1StatsText?: Phaser.GameObjects.Text;
  private player2NameText?: Phaser.GameObjects.Text;
  private player2IndexText?: Phaser.GameObjects.Text;
  private player2RoleText?: Phaser.GameObjects.Text;
  private player2StatsText?: Phaser.GameObjects.Text;
  private player2ModeText?: Phaser.GameObjects.Text;
  private player1LeftKey?: Phaser.Input.Keyboard.Key;
  private player1RightKey?: Phaser.Input.Keyboard.Key;
  private player2LeftKey?: Phaser.Input.Keyboard.Key;
  private player2RightKey?: Phaser.Input.Keyboard.Key;
  private player2ModeKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;
  private inputEnabledAt = 0;
  private transitionStarted = false;

  constructor() {
    super('CharacterSelectScene');
  }

  init(data: CharacterSelectSceneData = {}) {
    const stored = loadStoredSettings();

    this.player1FighterId = data.player1FighterId ?? stored.lastSelected.player1FighterId;
    this.player2FighterId = data.player2FighterId ?? stored.lastSelected.player2FighterId;
    this.player2Mode = data.player2Mode ?? stored.lastSelected.player2Mode;
    this.player1EquipmentId = getEquipmentDefinition(
      data.player1EquipmentId ?? stored.lastSelected.player1EquipmentId,
    ).id;
    this.player2EquipmentId = getEquipmentDefinition(
      data.player2EquipmentId ?? stored.lastSelected.player2EquipmentId,
    ).id;
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;
    this.player1Index = this.getFighterIndex(this.player1FighterId, defaultPlayer1FighterId);
    this.player2Index = this.getFighterIndex(this.player2FighterId, defaultPlayer2FighterId);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const safeMargin = uiSafeMargin;
    const safeTop = safeMargin;
    const safeBottom = layoutHeight - safeMargin;
    const safeWidth = layoutWidth - safeMargin * 2;
    const centerX = layoutWidth / 2;

    this.cameras.main.setBackgroundColor(0x111827);
    this.cameras.main.setScroll(0, 0);
    this.add.rectangle(centerX, layoutHeight / 2, layoutWidth, layoutHeight, 0x111827);

    const titleY = safeTop + 52;
    const subtitleY = titleY + 38;
    const footerControlsY = safeBottom - 64;
    const footerActionY = safeBottom - uiFooterPrimaryOffset;
    const cardGap = Phaser.Math.Clamp(safeWidth * 0.045, 36, 72);
    const availableCardWidth = (safeWidth - cardGap) / 2;
    const cardWidth = Math.min(640, Math.max(320, availableCardWidth));
    const totalCardsWidth = cardWidth * 2 + cardGap;
    const cardTop = subtitleY + 38;
    const cardBottom = footerControlsY - 30;
    const cardHeight = Phaser.Math.Clamp(cardBottom - cardTop, 286, 440);
    const cardCenterY = cardTop + cardHeight / 2;
    const player1CardX = centerX - totalCardsWidth / 2 + cardWidth / 2;
    const player2CardX = centerX + totalCardsWidth / 2 - cardWidth / 2;
    const cardTextWidth = Math.max(264, cardWidth - 56);
    const nameWrapWidth = Math.max(270, cardWidth - 64);
    const roleWrapWidth = cardTextWidth;
    const roleLabelY = cardTop + 176;
    const roleY = roleLabelY + 22;
    const statsY = Math.min(cardTop + 246, cardTop + cardHeight - 58);
    const statsPanelWidth = cardTextWidth;

    this.add.rectangle(centerX, cardCenterY, safeWidth, cardHeight + 28, 0x1e293b, 0.72).setStrokeStyle(4, 0x475569);
    this.add.rectangle(centerX, footerControlsY + 22, safeWidth, 74, 0x0f172a, 0.72).setStrokeStyle(2, 0x334155);

    this.add
      .text(centerX, titleY, 'キャラ選択', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, subtitleY, `${fighterDefinitions.length}キャラから選択 • 同キャラOK`, {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.add.rectangle(player1CardX, cardCenterY, cardWidth, cardHeight, 0x0f172a).setStrokeStyle(4, 0xf97316);
    this.add.rectangle(player2CardX, cardCenterY, cardWidth, cardHeight, 0x0f172a).setStrokeStyle(4, 0x38bdf8);
    this.add.rectangle(player1CardX, cardTop + 104, cardTextWidth, 48, 0x1e293b, 0.54);
    this.add.rectangle(player2CardX, cardTop + 104, cardTextWidth, 48, 0x1e293b, 0.54);
    this.add.rectangle(player1CardX, statsY + 22, statsPanelWidth, 58, 0x1e293b, 0.58).setStrokeStyle(2, 0x334155);
    this.add.rectangle(player2CardX, statsY + 22, statsPanelWidth, 58, 0x1e293b, 0.58).setStrokeStyle(2, 0x334155);

    this.add
      .text(player1CardX, cardTop + 28, 'P1', {
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
      })
      .setOrigin(0.5);
    this.add
      .text(player2CardX, cardTop + 28, 'P2', {
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
      })
      .setOrigin(0.5);

    this.add
      .text(player1CardX, cardTop + 66, '選択中', {
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(0.5);
    this.add
      .text(player2CardX, cardTop + 66, '選択中', {
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(0.5);

    this.add
      .text(player1CardX, roleLabelY, '特徴', {
        align: 'center',
        color: '#fdba74',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.add
      .text(player2CardX, roleLabelY, '特徴', {
        align: 'center',
        color: '#7dd3fc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);

    this.player1NameText = this.add
      .text(player1CardX, cardTop + 104, '', {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        wordWrap: { width: nameWrapWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    this.player1IndexText = this.add
      .text(player1CardX, cardTop + 136, '', {
        align: 'center',
        color: '#fcd9bd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.player1RoleText = this.add
      .text(player1CardX, roleY, '', {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        lineSpacing: 4,
        wordWrap: { width: roleWrapWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0);
    this.player1StatsText = this.add
      .text(player1CardX, statsY, '', {
        align: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        lineSpacing: 6,
        wordWrap: { width: cardTextWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0);
    this.player2NameText = this.add
      .text(player2CardX, cardTop + 104, '', {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        wordWrap: { width: nameWrapWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    this.player2IndexText = this.add
      .text(player2CardX, cardTop + 136, '', {
        align: 'center',
        color: '#d4f1ff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.player2ModeText = this.add
      .text(player2CardX, cardTop + 156, '', {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.player2RoleText = this.add
      .text(player2CardX, roleY, '', {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        lineSpacing: 4,
        wordWrap: { width: roleWrapWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0);
    this.player2StatsText = this.add
      .text(player2CardX, statsY, '', {
        align: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        lineSpacing: 6,
        wordWrap: { width: cardTextWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0);

    this.add
      .text(centerX, footerControlsY, 'P1: A/Dで選択   P2: ←/→で選択   P2↓: 2P/CPU切替', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);
    this.add
      .text(centerX, footerActionY, 'Enter/Space: 装備選択へ   Esc: ホームへ戻る', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    this.updateSelectionText();

    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.player1LeftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.player1RightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.player2LeftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.player2RightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.player2ModeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) {
      return;
    }

    let selectionChanged = false;

    if (this.player1LeftKey && Phaser.Input.Keyboard.JustDown(this.player1LeftKey)) {
      this.player1Index = this.getNextFighterIndex(this.player1Index, -1);
      selectionChanged = true;
    }

    if (this.player1RightKey && Phaser.Input.Keyboard.JustDown(this.player1RightKey)) {
      this.player1Index = this.getNextFighterIndex(this.player1Index, 1);
      selectionChanged = true;
    }

    if (this.player2LeftKey && Phaser.Input.Keyboard.JustDown(this.player2LeftKey)) {
      this.player2Index = this.getNextFighterIndex(this.player2Index, -1);
      selectionChanged = true;
    }

    if (this.player2RightKey && Phaser.Input.Keyboard.JustDown(this.player2RightKey)) {
      this.player2Index = this.getNextFighterIndex(this.player2Index, 1);
      selectionChanged = true;
    }

    if (this.player2ModeKey && Phaser.Input.Keyboard.JustDown(this.player2ModeKey)) {
      this.player2Mode = this.player2Mode === 'human' ? 'cpu' : 'human';
      selectionChanged = true;
    }

    if (selectionChanged) {
      this.updateSelectionText();
    }

    if (this.escapeKey && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.transitionStarted = true;
      this.scene.start('HomeScene');
      return;
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      const player1FighterId = fighterDefinitions[this.player1Index].id;
      const player2FighterId = fighterDefinitions[this.player2Index].id;

      saveLastSelected({
        player1FighterId,
        player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });

      this.transitionStarted = true;
      this.scene.start('EquipmentSelectScene', {
        player1FighterId,
        player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });
    }
  }

  private getFighterIndex(fighterId: string, fallbackFighterId: string) {
    const fighterIndex = fighterDefinitions.findIndex((definition) => definition.id === fighterId);

    if (fighterIndex >= 0) {
      return fighterIndex;
    }

    const fallbackIndex = fighterDefinitions.findIndex((definition) => definition.id === fallbackFighterId);

    return fallbackIndex >= 0 ? fallbackIndex : 0;
  }

  private getNextFighterIndex(currentIndex: number, direction: -1 | 1) {
    return (currentIndex + direction + fighterDefinitions.length) % fighterDefinitions.length;
  }

  private updateSelectionText() {
    const player1Definition = fighterDefinitions[this.player1Index];
    const player2Definition = fighterDefinitions[this.player2Index];

    this.player1NameText?.setText(`< ${getFighterDisplayNameJa(player1Definition.id)} >`);
    this.player1IndexText?.setText(`キャラ ${this.player1Index + 1} / ${fighterDefinitions.length}`);
    this.player1RoleText?.setText(getFighterDescriptionJa(player1Definition.id));
    this.player1StatsText?.setText(this.getStatsText(player1Definition));
    this.player2NameText?.setText(`< ${getFighterDisplayNameJa(player2Definition.id)} >`);
    this.player2IndexText?.setText(`キャラ ${this.player2Index + 1} / ${fighterDefinitions.length}`);
    this.player2ModeText?.setText(`P2操作: ${this.getPlayer2ModeLabel()} (↓)`);
    this.player2RoleText?.setText(getFighterDescriptionJa(player2Definition.id));
    this.player2StatsText?.setText(this.getStatsText(player2Definition));
  }

  private getPlayer2ModeLabel() {
    return this.player2Mode === 'cpu' ? 'CPU' : '2P';
  }

  private getStatsText(definition: FighterDefinition) {
    return `HP ${definition.stats.maxHp} / 攻撃力 ${definition.stats.attackDamage}
速度 ${definition.stats.moveSpeed} / ふっとばし ${definition.stats.knockbackSpeed}`;
  }
}

class BattleScene extends Phaser.Scene {
  private player1!: Fighter;
  private player2!: Fighter;
  private player1Hp!: PlayerHp;
  private player2Hp!: PlayerHp;
  private pendingAttacks: PendingAttack[] = [];
  private activeAttacks: ActiveAttack[] = [];
  private player1FighterId = defaultPlayer1FighterId;
  private player2FighterId = defaultPlayer2FighterId;
  private player2Mode = defaultPlayer2Mode;
  private player1EquipmentId: EquipmentId = 'none';
  private player2EquipmentId: EquipmentId = 'none';
  private player1Equipment = getEquipmentDefinition('none');
  private player2Equipment = getEquipmentDefinition('none');
  private player1Definition = defaultPlayer1FighterDefinition;
  private player2Definition = defaultPlayer2FighterDefinition;
  private matchOver = false;
  private matchStarted = false;
  private matchTimerRemainingSeconds = matchTimerDurationSeconds;
  private matchTimerText?: Phaser.GameObjects.Text;
  private startPrompt?: Phaser.GameObjects.Text;
  private startCountdownEvent?: Phaser.Time.TimerEvent;
  private startPromptClearEvent?: Phaser.Time.TimerEvent;
  private resultTransitionEvent?: Phaser.Time.TimerEvent;
  private pauseOverlay?: Phaser.GameObjects.Container;
  private pauseKey?: Phaser.Input.Keyboard.Key;
  private retirePlayer1Key?: Phaser.Input.Keyboard.Key;
  private retirePlayer2Key?: Phaser.Input.Keyboard.Key;
  private pendingRetirePlayer?: RetirePlayer;
  private isPaused = false;
  private pauseStartedAt = 0;
  private hitMarker?: Phaser.GameObjects.Text;
  private hitMarkerSubLabel?: Phaser.GameObjects.Text;
  private hitMarkerEvent?: Phaser.Time.TimerEvent;
  private activeHitSparks: Phaser.GameObjects.Rectangle[] = [];
  private hitSparkEvents: Phaser.Time.TimerEvent[] = [];
  private activeJustGuardFeedback: Phaser.GameObjects.Ellipse[] = [];
  private justGuardFeedbackEvents: Phaser.Time.TimerEvent[] = [];
  private nextCpuDecisionAt = 0;
  private cpuRetreatUntil = 0;
  private effectsEnabled = true;
  private screenShakeEnabled = true;
  private player1EquipmentHudText?: Phaser.GameObjects.Text;
  private player2EquipmentHudText?: Phaser.GameObjects.Text;
  private player1AmpAccent?: Phaser.GameObjects.Arc;
  private player2AmpAccent?: Phaser.GameObjects.Arc;
  private hitboxDebugKey?: Phaser.Input.Keyboard.Key;
  private hitboxDebugEnabled = false;
  private hitboxDebugGraphics?: Phaser.GameObjects.Graphics;
  private hitboxDebugText?: Phaser.GameObjects.Text;
  private controls?: {
    player1: PlayerControls;
    player2: PlayerControls;
  };

  constructor() {
    super('BattleScene');
  }

  init(data: BattleSceneData = {}) {
    this.player1FighterId = data.player1FighterId ?? defaultPlayer1FighterId;
    this.player2FighterId = data.player2FighterId ?? defaultPlayer2FighterId;
    this.player2Mode = data.player2Mode ?? defaultPlayer2Mode;
    this.player1Definition = getFighterDefinition(this.player1FighterId);
    this.player2Definition = getFighterDefinition(this.player2FighterId);
    this.player1EquipmentId = this.resolveBattleEquipmentIdForFighter(
      this.player1FighterId,
      getEquipmentDefinition(data.player1EquipmentId).id,
    );
    this.player2EquipmentId = this.resolveBattleEquipmentIdForFighter(
      this.player2FighterId,
      getEquipmentDefinition(data.player2EquipmentId).id,
    );
    this.player1Equipment = getEquipmentDefinition(this.player1EquipmentId);
    this.player2Equipment = getEquipmentDefinition(this.player2EquipmentId);
  }

  create() {
    this.matchOver = false;
    this.matchStarted = false;
    this.matchTimerRemainingSeconds = matchTimerDurationSeconds;
    this.pendingAttacks = [];
    this.activeAttacks = [];
    this.nextCpuDecisionAt = 0;
    this.cpuRetreatUntil = 0;
    const stored = loadStoredSettings();
    this.effectsEnabled = stored.preferences.effectsEnabled;
    this.screenShakeEnabled = stored.preferences.screenShakeEnabled;
    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.pauseKey = undefined;
    this.hitboxDebugKey = undefined;
    this.hitboxDebugEnabled = false;
    this.destroyHitboxDebugOverlay();
    this.retirePlayer1Key = undefined;
    this.retirePlayer2Key = undefined;
    this.pendingRetirePlayer = undefined;
    this.destroyPauseOverlay();
    this.startCountdownEvent?.remove(false);
    this.startCountdownEvent = undefined;
    this.startPromptClearEvent?.remove(false);
    this.startPromptClearEvent = undefined;
    this.resultTransitionEvent?.remove(false);
    this.resultTransitionEvent = undefined;
    this.clearHitSparks();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupBattleScene, this);

    addViewportBackground(this);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const hudSafeMargin = 32;
    const hudLeft = camera.scrollX + hudSafeMargin;
    const hudRight = camera.scrollX + layoutWidth - hudSafeMargin;
    const hudTop = camera.scrollY + hudSafeMargin;
    const hudBottom = camera.scrollY + layoutHeight - hudSafeMargin;
    const hudCenterX = camera.scrollX + layoutWidth / 2;
    const hudPanelWidth = Math.min(360, Math.max(260, (layoutWidth - hudSafeMargin * 2 - 260) / 2));
    const hudPanelHeight = 112;
    const hudPanelY = hudTop + hudPanelHeight / 2;
    const p1HudLeft = hudLeft;
    const p2HudRight = hudRight;
    const p2HudLeft = p2HudRight - hudPanelWidth;
    const p1HudX = p1HudLeft + 16;
    const p2HudX = p2HudRight - 16;
    const hudTextY = hudTop + 18;
    const equipmentY = hudTop + 76;
    const instructionText = this.player2Mode === 'cpu'
      ? 'P1 A/D + W/Space   P2 CPU   P: 操作確認'
      : 'P1 A/D + W/Space   P2 ←/→ + ↑/Enter   P: 操作確認';

    this.add.rectangle(400, 360, 720, 260, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 286, 660, 4, 0x334155, 0.7);
    this.add.rectangle(400, 392, 660, 4, 0x334155, 0.45);
    this.add.rectangle(400, 468, 660, 3, 0x475569, 0.55);
    this.add.rectangle(400, 500, 680, 44, 0x334155);
    this.add.rectangle(400, 480, 680, 5, 0x94a3b8, 0.45);
    this.add.rectangle(400, 506, 18, 32, 0x475569, 0.55);
    this.add.rectangle(player1StartX, 516, 132, 10, 0x0f172a, 0.42);
    this.add.rectangle(player2StartX, 516, 132, 10, 0x0f172a, 0.42);

    this.add.rectangle(p1HudLeft + hudPanelWidth / 2, hudPanelY, hudPanelWidth, hudPanelHeight, 0x0f172a, 0.82).setStrokeStyle(3, 0xf97316);
    this.add.rectangle(p2HudLeft + hudPanelWidth / 2, hudPanelY, hudPanelWidth, hudPanelHeight, 0x0f172a, 0.82).setStrokeStyle(3, 0x38bdf8);
    this.add.rectangle(hudCenterX, hudTop + 42, 150, 46, 0x020617, 0.42).setStrokeStyle(2, 0x334155);
    this.matchTimerText = this.add.text(hudCenterX, hudTop + 42, '', {
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px',
    }).setOrigin(0.5);
    this.updateMatchTimerText();

    this.player1Hp = this.createHpUi(
      p1HudX,
      hudTextY,
      `P1 ${getFighterShortLabelJa(this.player1FighterId)}`,
      this.player1Definition.stats.maxHp,
      this.player1Definition.labelColor,
      0x22c55e,
      0,
    );
    this.player2Hp = this.createHpUi(
      p2HudX,
      hudTextY,
      `${this.player2Mode === 'cpu' ? 'P2 CPU' : 'P2'} ${getFighterShortLabelJa(this.player2FighterId)}`,
      this.player2Definition.stats.maxHp,
      this.player2Definition.labelColor,
      0x38bdf8,
      1,
    );

    this.player1EquipmentHudText = this.add
      .text(p1HudX, equipmentY, `装備: ${getEquipmentShortLabelJa(this.player1Equipment.id)}`, {
        color: '#86efac',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(0, 0);

    this.player2EquipmentHudText = this.add
      .text(p2HudX, equipmentY, `装備: ${getEquipmentShortLabelJa(this.player2Equipment.id)}`, {
        color: '#93c5fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(1, 0);

    this.add.rectangle(hudCenterX, hudBottom - 22, Math.min(720, layoutWidth - hudSafeMargin * 2), 34, 0x020617, 0.58).setStrokeStyle(2, 0x334155);
    this.add
      .text(hudCenterX, hudBottom - 22, instructionText, {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(0.5);

    this.player1 = this.createFighter(player1StartX, 'P1', this.player1Definition);
    this.player2 = this.createFighter(player2StartX, 'P2', this.player2Definition);
    this.player2.facing = -1;
    this.createAmpAccents();
    this.createHitboxDebugOverlay();
    this.controls = this.createControls();
    this.showMatchStartPrompt();
  }

  update(time: number, delta: number) {
    if (!this.controls) {
      return;
    }

    if (this.hitboxDebugKey && Phaser.Input.Keyboard.JustDown(this.hitboxDebugKey)) {
      this.toggleHitboxDebugOverlay();
    }

    if (this.pauseKey && !this.matchOver && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause(time);
    }

    if (this.isPaused) {
      this.updateRetireConfirmationInput();
      this.updateHitboxDebugOverlay();
      return;
    }

    if (this.matchOver || !this.matchStarted) {
      this.updateHitboxDebugOverlay();
      return;
    }

    this.updateMatchTimer(delta);

    if (this.matchOver) {
      return;
    }

    this.updateGuardState(this.player1, this.controls.player1, time);
    this.moveFighter(this.player1, this.controls.player1, delta);
    this.tryAttack(this.player1, this.controls.player1, time);

    if (this.player2Mode === 'cpu') {
      this.clearGuardState(this.player2);
      this.updateCpu(time, delta);
    } else {
      this.updateGuardState(this.player2, this.controls.player2, time);
      this.moveFighter(this.player2, this.controls.player2, delta);
      this.tryAttack(this.player2, this.controls.player2, time);
    }
    this.updateAmpAccents(time);
    this.updatePendingAttacks(time);
    this.updateActiveAttacks(time);
    this.updateKnockback(this.player1, delta);
    this.updateKnockback(this.player2, delta);
    this.updateGuardFeedback(this.player1);
    this.updateGuardFeedback(this.player2);
    this.updateHitboxDebugOverlay();
  }

  private createAmpAccents() {
    if (!this.effectsEnabled) {
      return;
    }

    if (this.hasAmpReach(this.player1)) {
      this.player1AmpAccent = this.add
        .circle(this.player1.body.x, this.player1.body.y + 74, 30, 0xf59e0b, 0.12)
        .setStrokeStyle(2, 0xfbbf24, 0.38)
        .setDepth(0);
    }

    if (this.hasAmpReach(this.player2)) {
      this.player2AmpAccent = this.add
        .circle(this.player2.body.x, this.player2.body.y + 74, 30, 0x38bdf8, 0.12)
        .setStrokeStyle(2, 0x7dd3fc, 0.38)
        .setDepth(0);
    }
  }

  private updateAmpAccents(time: number) {
    const pulse = 0.5 + Math.sin(time * 0.01) * 0.08;

    if (this.player1AmpAccent) {
      this.player1AmpAccent.setPosition(this.player1.body.x, this.player1.body.y + 74);
      this.player1AmpAccent.setScale(pulse);
    }

    if (this.player2AmpAccent) {
      this.player2AmpAccent.setPosition(this.player2.body.x, this.player2.body.y + 74);
      this.player2AmpAccent.setScale(pulse);
    }
  }


  private updateMatchTimer(delta: number) {
    this.matchTimerRemainingSeconds = Math.max(0, this.matchTimerRemainingSeconds - delta / 1000);
    this.updateMatchTimerText();

    if (this.matchTimerRemainingSeconds <= 0) {
      this.finishMatchByTimeUp();
    }
  }

  private updateMatchTimerText() {
    this.matchTimerText?.setText(`${Math.ceil(this.matchTimerRemainingSeconds)}`);
  }

  private showMatchStartPrompt() {
    this.startPrompt?.destroy();
    this.startPrompt = this.add
      .text(400, 292, 'Ready?', {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '56px',
      })
      .setOrigin(0.5)
      .setDepth(5);

    this.startCountdownEvent = this.time.delayedCall(matchStartDelayMs, () => {
      this.matchStarted = true;
      this.startCountdownEvent = undefined;
      this.startPrompt?.setText('Fight!');
      this.startPromptClearEvent = this.time.delayedCall(matchStartFightTextDurationMs, () => {
        this.startPrompt?.destroy();
        this.startPrompt = undefined;
        this.startPromptClearEvent = undefined;
      });
    });
  }

  private createHpUi(
    x: number,
    y: number,
    playerName: string,
    maxHp: number,
    textColor: string,
    barColor: number,
    alignX: 0 | 1,
  ): PlayerHp {
    const text = this.add
      .text(x, y, '', {
        color: textColor,
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(alignX, 0);
    const barBackground = this.add
      .rectangle(x, y + 30, hpBarWidth, hpBarHeight, 0x020617)
      .setOrigin(alignX, 0)
      .setStrokeStyle(2, 0x475569);
    const barFillX = alignX === 0 ? x + hpBarInset : x - hpBarInset;
    const barFill = this.add
      .rectangle(barFillX, y + 30 + hpBarInset, hpBarWidth - hpBarInset * 2, hpBarHeight - hpBarInset * 2, barColor)
      .setOrigin(alignX, 0);
    const hp = {
      name: playerName,
      current: maxHp,
      max: maxHp,
      text,
      barBackground,
      barFill,
      barMaxWidth: hpBarWidth - hpBarInset * 2,
    };

    this.updateHpUi(hp);

    return hp;
  }

  private createFighter(x: number, playerLabel: string, definition: FighterDefinition): Fighter {
    const bodyWidth = definition.bodyWidth ?? defaultFighterBodyWidth;
    const bodyHeight = definition.bodyHeight ?? defaultFighterBodyHeight;
    const body = this.add
      .rectangle(x, 440, bodyWidth, bodyHeight, definition.bodyColor)
      .setStrokeStyle(3, definition.bodyStrokeColor);
    const labelText = this.add
      .text(x, body.y + bodyHeight / 2 + 20, `${playerLabel}\n${definition.displayName}`, {
        align: 'center',
        color: definition.labelColor,
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5, 0);
    const guardIndicator = this.add
      .ellipse(x, body.y, bodyWidth + 28, bodyHeight + 30, 0x38bdf8, 0.1)
      .setStrokeStyle(3, 0xa7f3d0, 0.78)
      .setDepth(2)
      .setVisible(false);

    return {
      body,
      label: labelText,
      facing: 1,
      nextAttackAt: 0,
      knockbackVelocity: 0,
      isGuarding: false,
      guardStartedAt: 0,
      normalColor: definition.bodyColor,
      stats: definition.stats,
      definition,
      guardIndicator,
    };
  }

  private getFighterBodyHalfWidth(fighter: Fighter) {
    return fighter.body.width / 2;
  }

  private createControls() {
    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return undefined;
    }

    const keys = keyboard.addKeys({
      player1Left: Phaser.Input.Keyboard.KeyCodes.A,
      player1Right: Phaser.Input.Keyboard.KeyCodes.D,
      player1Attack: Phaser.Input.Keyboard.KeyCodes.W,
      player1AltAttack: Phaser.Input.Keyboard.KeyCodes.SPACE,
      player1Guard: Phaser.Input.Keyboard.KeyCodes.S,
      player2Left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      player2Right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      player2Attack: Phaser.Input.Keyboard.KeyCodes.UP,
      player2AltAttack: Phaser.Input.Keyboard.KeyCodes.ENTER,
      player2Guard: Phaser.Input.Keyboard.KeyCodes.DOWN,
      pause: Phaser.Input.Keyboard.KeyCodes.P,
      hitboxDebug: Phaser.Input.Keyboard.KeyCodes.H,
      retirePlayer1: Phaser.Input.Keyboard.KeyCodes.ONE,
      retirePlayer2: Phaser.Input.Keyboard.KeyCodes.TWO,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.pauseKey = keys.pause;
    this.hitboxDebugKey = keys.hitboxDebug;
    this.retirePlayer1Key = keys.retirePlayer1;
    this.retirePlayer2Key = keys.retirePlayer2;

    return {
      player1: {
        left: keys.player1Left,
        right: keys.player1Right,
        attacks: [keys.player1Attack, keys.player1AltAttack],
        guardKey: keys.player1Guard,
      },
      player2: {
        left: keys.player2Left,
        right: keys.player2Right,
        attacks: [keys.player2Attack, keys.player2AltAttack],
        guardKey: keys.player2Guard,
      },
    };
  }

  private createHitboxDebugOverlay() {
    this.hitboxDebugGraphics?.destroy();
    this.hitboxDebugText?.destroy();

    const camera = this.cameras.main;
    this.hitboxDebugGraphics = this.add.graphics().setDepth(50).setVisible(false);
    this.hitboxDebugText = this.add
      .text(camera.scrollX + 24, camera.scrollY + 148, 'Hitbox Debug ON (H)', {
        color: '#fef08a',
        fontFamily: 'monospace',
        fontSize: '16px',
        backgroundColor: '#020617',
        padding: { x: 8, y: 4 },
      })
      .setDepth(51)
      .setVisible(false);
  }

  private toggleHitboxDebugOverlay() {
    this.hitboxDebugEnabled = !this.hitboxDebugEnabled;

    if (!this.hitboxDebugEnabled) {
      this.hitboxDebugGraphics?.clear();
    }

    this.hitboxDebugGraphics?.setVisible(this.hitboxDebugEnabled);
    this.hitboxDebugText?.setVisible(this.hitboxDebugEnabled);
  }

  private updateHitboxDebugOverlay() {
    if (!this.hitboxDebugEnabled || !this.hitboxDebugGraphics || !this.hitboxDebugText) {
      return;
    }

    const graphics = this.hitboxDebugGraphics;
    const camera = this.cameras.main;
    this.hitboxDebugText.setPosition(camera.scrollX + 24, camera.scrollY + 148);
    graphics.clear();
    this.drawFighterDebugOverlay(this.player1, 0xf97316);
    this.drawFighterDebugOverlay(this.player2, 0x38bdf8);

    for (const attack of this.activeAttacks) {
      const attackBounds = attack.hitbox.getBounds();
      graphics.lineStyle(3, attack.hasHit ? 0xfbbf24 : 0xef4444, 0.95);
      graphics.strokeRect(attackBounds.x, attackBounds.y, attackBounds.width, attackBounds.height);
      graphics.fillStyle(attack.hasHit ? 0xfbbf24 : 0xef4444, attack.hasHit ? 0.08 : 0.14);
      graphics.fillRect(attackBounds.x, attackBounds.y, attackBounds.width, attackBounds.height);
    }
  }

  private drawFighterDebugOverlay(fighter: Fighter, color: number) {
    if (!this.hitboxDebugGraphics) {
      return;
    }

    const graphics = this.hitboxDebugGraphics;
    const bodyBounds = fighter.body.getBounds();
    const centerX = fighter.body.x;
    const centerY = fighter.body.y;
    const attackCenterY = centerY + fighter.stats.attackYOffset;
    const frontX = centerX + fighter.facing * this.getFighterBodyHalfWidth(fighter);
    const projectedHitboxCenterX = frontX + fighter.facing * (this.getEffectiveAttackWidth(fighter) / 2);

    graphics.lineStyle(2, color, 0.95);
    graphics.strokeRect(bodyBounds.x, bodyBounds.y, bodyBounds.width, bodyBounds.height);

    graphics.fillStyle(color, 0.95);
    graphics.fillCircle(centerX, centerY, 4);

    graphics.lineStyle(2, 0xfef08a, 0.9);
    graphics.beginPath();
    graphics.moveTo(centerX, attackCenterY);
    graphics.lineTo(projectedHitboxCenterX, attackCenterY);
    graphics.strokePath();
    this.drawDebugArrowHead(projectedHitboxCenterX, attackCenterY, fighter.facing, 0xfef08a);

    graphics.fillStyle(0xfef08a, 0.95);
    graphics.fillCircle(projectedHitboxCenterX, attackCenterY, 3);
  }

  private drawDebugArrowHead(x: number, y: number, facing: -1 | 1, color: number) {
    if (!this.hitboxDebugGraphics) {
      return;
    }

    const graphics = this.hitboxDebugGraphics;
    const tipX = x + facing * 9;
    graphics.lineStyle(2, color, 0.9);
    graphics.beginPath();
    graphics.moveTo(tipX, y);
    graphics.lineTo(x, y - 6);
    graphics.moveTo(tipX, y);
    graphics.lineTo(x, y + 6);
    graphics.strokePath();
  }

  private destroyHitboxDebugOverlay() {
    this.hitboxDebugGraphics?.destroy();
    this.hitboxDebugText?.destroy();
    this.hitboxDebugGraphics = undefined;
    this.hitboxDebugText = undefined;
  }

  private togglePause(time: number) {
    if (this.isPaused) {
      this.resumeBattle(time);
      return;
    }

    this.pauseBattle(time);
  }

  private pauseBattle(time: number) {
    this.pendingRetirePlayer = undefined;
    this.isPaused = true;
    this.pauseStartedAt = time;
    this.setPausableTimersPaused(true);
    this.showPauseOverlay();
  }

  private resumeBattle(time: number) {
    const pausedDuration = Math.max(0, time - this.pauseStartedAt);

    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.pendingRetirePlayer = undefined;
    this.shiftPausedTimestamps(pausedDuration);
    this.setPausableTimersPaused(false);
    this.destroyPauseOverlay();
  }

  private shiftPausedTimestamps(pausedDuration: number) {
    if (pausedDuration <= 0) {
      return;
    }

    this.player1.nextAttackAt += pausedDuration;
    this.player2.nextAttackAt += pausedDuration;
    this.nextCpuDecisionAt += pausedDuration;
    this.cpuRetreatUntil += pausedDuration;

    for (const pendingAttack of this.pendingAttacks) {
      pendingAttack.activeStartsAt += pausedDuration;
    }

    for (const attack of this.activeAttacks) {
      attack.activeStartedAt += pausedDuration;
      attack.expiresAt += pausedDuration;
    }
  }

  private setPausableTimersPaused(paused: boolean) {
    if (this.startCountdownEvent) {
      this.startCountdownEvent.paused = paused;
    }

    if (this.startPromptClearEvent) {
      this.startPromptClearEvent.paused = paused;
    }

    if (this.hitMarkerEvent) {
      this.hitMarkerEvent.paused = paused;
    }

    for (const feedbackEvent of this.justGuardFeedbackEvents) {
      feedbackEvent.paused = paused;
    }

    if (this.player1?.hitFlashEvent) {
      this.player1.hitFlashEvent.paused = paused;
    }

    if (this.player2?.hitFlashEvent) {
      this.player2.hitFlashEvent.paused = paused;
    }

    for (const sparkEvent of this.hitSparkEvents) {
      sparkEvent.paused = paused;
    }
  }

  private showPauseOverlay() {
    this.destroyPauseOverlay();

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const centerX = camera.scrollX + layoutWidth / 2;
    const centerY = camera.scrollY + layoutHeight / 2;
    const panelWidth = Math.min(720, layoutWidth - uiPanelOuterMargin);
    const panelHeight = Math.min(480, layoutHeight - uiPanelOuterMargin);
    const panelTop = -panelHeight / 2;
    const panelLeft = -panelWidth / 2;
    const columnGap = 28;
    const columnWidth = (panelWidth - uiPanelContentInset - columnGap) / 2;
    const currentMode = this.player2Mode === 'cpu' ? 'CPU' : '2P';
    const player2Lines = this.player2Mode === 'cpu'
      ? ['CPUが自動操作', 'P2手動操作は不要']
      : ['← / →: 移動', '↑ / Enter: 攻撃'];
    const retireTitle = this.pendingRetirePlayer
      ? `${this.pendingRetirePlayer === 'p1' ? 'P1' : 'P2'} リタイア確認`
      : 'リタイア / Forfeit';
    const retireLines = this.pendingRetirePlayer === 'p1'
      ? ['1: P1リタイアを確定', 'P: キャンセルして再開']
      : this.pendingRetirePlayer === 'p2'
        ? ['2: P2リタイアを確定', 'P: キャンセルして再開']
        : ['1: P1リタイア / 2: P2リタイア', 'P: 再開 / キャンセル'];

    const overlay = this.add.container(centerX, centerY).setDepth(20);

    overlay.add([
      this.add.rectangle(0, 0, layoutWidth, layoutHeight, 0x020617, 0.72),
      this.add.rectangle(0, 0, panelWidth, panelHeight, 0x111827, 0.96).setStrokeStyle(4, 0xfacc15),
      this.add.text(0, panelTop + 40, '一時停止 / 操作確認', {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '32px',
      }).setOrigin(0.5),
      this.add.text(0, panelTop + 78, `現在のP2操作: ${currentMode}`, {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      }).setOrigin(0.5),
      this.add.rectangle(panelLeft + 48 + columnWidth / 2, panelTop + 188, columnWidth, 178, 0x0f172a, 0.86).setStrokeStyle(2, 0xf97316),
      this.add.rectangle(panelLeft + 48 + columnWidth + columnGap + columnWidth / 2, panelTop + 188, columnWidth, 178, 0x0f172a, 0.86).setStrokeStyle(2, 0x38bdf8),
      this.add.text(panelLeft + 72, panelTop + 118, 'P1 操作', {
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      }).setOrigin(0, 0),
      this.add.text(panelLeft + 72, panelTop + 154, ['A / D: 移動', 'W / Space: 攻撃'], {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        lineSpacing: 10,
      }).setOrigin(0, 0),
      this.add.text(panelLeft + 72 + columnWidth + columnGap, panelTop + 118, this.player2Mode === 'cpu' ? 'P2 CPU' : 'P2 操作', {
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      }).setOrigin(0, 0),
      this.add.text(panelLeft + 72 + columnWidth + columnGap, panelTop + 154, player2Lines, {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        lineSpacing: 10,
      }).setOrigin(0, 0),
      this.add.rectangle(0, panelTop + panelHeight - 156, panelWidth - uiPanelContentInset, 56, 0x3f1f1f, 0.72).setStrokeStyle(2, 0xf97316),
      this.add.text(panelLeft + 72, panelTop + panelHeight - 176, retireTitle, {
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      }).setOrigin(0, 0),
      this.add.text(panelLeft + 72, panelTop + panelHeight - 148, retireLines, {
        color: this.pendingRetirePlayer ? '#fecaca' : '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        lineSpacing: 6,
      }).setOrigin(0, 0),
      this.add.rectangle(0, panelTop + panelHeight - 76, panelWidth - uiPanelContentInset, 56, 0x1e293b, 0.72).setStrokeStyle(2, 0x334155),
      this.add.text(panelLeft + 72, panelTop + panelHeight - 98, '基本ルール', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      }).setOrigin(0, 0),
      this.add.text(panelLeft + 72, panelTop + panelHeight - 70, ['1回の攻撃で当たるのは1回だけ', '結果画面: R再戦 / Cキャラ選択 / Enter・Spaceホーム'], {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        lineSpacing: 6,
      }).setOrigin(0, 0),
    ]);

    this.pauseOverlay = overlay;
  }

  private destroyPauseOverlay() {
    this.pauseOverlay?.destroy(true);
    this.pauseOverlay = undefined;
  }

  private updateRetireConfirmationInput() {
    if (this.matchOver || !this.matchStarted) {
      return;
    }

    if (this.retirePlayer1Key && Phaser.Input.Keyboard.JustDown(this.retirePlayer1Key)) {
      this.handleRetireConfirmationInput('p1');
    }

    if (this.retirePlayer2Key && Phaser.Input.Keyboard.JustDown(this.retirePlayer2Key)) {
      this.handleRetireConfirmationInput('p2');
    }
  }

  private handleRetireConfirmationInput(player: RetirePlayer) {
    if (this.matchOver) {
      return;
    }

    if (this.pendingRetirePlayer === player) {
      this.finishMatchByRetire(player);
      return;
    }

    this.pendingRetirePlayer = player;
    this.showPauseOverlay();
  }

  private finishMatchByRetire(retiringPlayer: RetirePlayer) {
    const resultData = retiringPlayer === 'p1'
      ? { result: 'p2' as const, displayTitle: this.player2.definition.resultWinText, matchEndReason: 'retire' as const }
      : { result: 'p1' as const, displayTitle: this.player1.definition.resultWinText, matchEndReason: 'retire' as const };

    this.endMatch(resultData);
  }

  private updateGuardState(fighter: Fighter, keys: PlayerControls, time: number) {
    const isGuardKeyDown = keys.guardKey.isDown;

    if (isGuardKeyDown && !fighter.isGuarding) {
      fighter.isGuarding = true;
      fighter.guardStartedAt = time;
      return;
    }

    if (!isGuardKeyDown && fighter.isGuarding) {
      this.clearGuardState(fighter);
    }
  }

  private clearGuardState(fighter: Fighter) {
    fighter.isGuarding = false;
    fighter.guardStartedAt = 0;
  }

  private updateGuardFeedback(fighter: Fighter) {
    fighter.guardIndicator
      ?.setPosition(fighter.body.x, fighter.body.y)
      .setVisible(fighter.isGuarding && !this.matchOver);
  }

  private clearGuardFeedback(fighter: Fighter) {
    fighter.guardIndicator?.setVisible(false);
  }

  private moveFighter(fighter: Fighter, keys: PlayerControls, delta: number) {
    let horizontalInput = 0;

    if (keys.left.isDown) {
      horizontalInput -= 1;
    }

    if (keys.right.isDown) {
      horizontalInput += 1;
    }

    if (horizontalInput !== 0) {
      fighter.facing = horizontalInput < 0 ? -1 : 1;
    }

    this.moveFighterByDirection(fighter, horizontalInput, delta);
  }

  private moveFighterByDirection(fighter: Fighter, horizontalInput: number, delta: number) {
    const direction = Phaser.Math.Clamp(horizontalInput, -1, 1);

    if (direction !== 0) {
      fighter.facing = direction < 0 ? -1 : 1;
    }

    const movementMultiplier = fighter.isGuarding ? normalGuardMovementMultiplier : 1;
    const distance = fighter.stats.moveSpeed * movementMultiplier * (delta / 1000);
    const bodyHalfWidth = this.getFighterBodyHalfWidth(fighter);
    const nextX = Phaser.Math.Clamp(
      fighter.body.x + direction * distance,
      bodyHalfWidth,
      gameWidth - bodyHalfWidth,
    );

    fighter.body.setX(nextX);
    fighter.label.setX(nextX);
  }

  private tryAttack(fighter: Fighter, keys: PlayerControls, time: number) {
    if (this.matchOver) {
      return;
    }

    const wantsAttack = keys.attacks.some((key) => Phaser.Input.Keyboard.JustDown(key));

    if (!wantsAttack || fighter.isGuarding || time < fighter.nextAttackAt) {
      return;
    }

    this.startAttack(fighter, time);
  }

  private startAttack(fighter: Fighter, time: number) {
    if (this.matchOver || fighter.isGuarding || time < fighter.nextAttackAt) {
      return;
    }

    const timing = this.getAttackTiming(fighter);
    fighter.nextAttackAt = time + timing.cooldownMs;
    const opponent = fighter === this.player1 ? this.player2 : this.player1;
    const opponentHp = fighter === this.player1 ? this.player2Hp : this.player1Hp;

    this.queueAttackStartup(fighter, opponent, opponentHp, timing, time);
  }

  private updateCpu(time: number, delta: number) {
    if (this.matchOver || !this.matchStarted) {
      return;
    }

    const distanceToPlayer1 = this.player1.body.x - this.player2.body.x;
    const absDistance = Math.abs(distanceToPlayer1);
    const directionToPlayer1 = distanceToPlayer1 < 0 ? -1 : 1;
    const attackDistance = this.getFighterBodyHalfWidth(this.player1) +
      this.getFighterBodyHalfWidth(this.player2) +
      this.getEffectiveAttackWidth(this.player2) +
      cpuAttackDistancePadding;

    if (time >= this.nextCpuDecisionAt) {
      this.nextCpuDecisionAt = time + cpuDecisionIntervalMs;

      if (absDistance < cpuComfortDistance && Math.random() < cpuRetreatChance) {
        this.cpuRetreatUntil = time + cpuRetreatDurationMs;
      }
    }

    if (absDistance <= attackDistance) {
      this.player2.facing = directionToPlayer1;
      this.startAttack(this.player2, time);
    }

    const shouldRetreat = time < this.cpuRetreatUntil;
    const moveDirection = shouldRetreat
      ? -directionToPlayer1
      : absDistance > cpuComfortDistance
        ? directionToPlayer1
        : 0;

    this.moveFighterByDirection(this.player2, moveDirection, delta);
  }


  private getAttackVisualStyle(fighter: Fighter): AttackVisualStyle {
    const palette = attackVisualPaletteByFighterId[fighter.definition.id];

    if (!palette || palette.length === 0) {
      return {
        fillColor: fighter.stats.attackColor,
        strokeColor: fighter.stats.attackStrokeColor,
      };
    }

    return Phaser.Math.RND.pick(palette);
  }

  private getAttackTiming(fighter: Fighter): AttackTiming {
    return attackTimingByFighterId[fighter.definition.id] ?? defaultAttackTiming;
  }

  private queueAttackStartup(fighter: Fighter, opponent: Fighter, opponentHp: PlayerHp, timing: AttackTiming, time: number) {
    const activeStartsAt = time + timing.startupMs;

    if (timing.startupMs <= 0) {
      this.createAttackHitbox(fighter, opponent, opponentHp, timing, time);
      return;
    }

    this.pendingAttacks.push({
      attacker: fighter,
      defender: opponent,
      defenderHp: opponentHp,
      timing,
      activeStartsAt,
    });
  }

  private updatePendingAttacks(time: number) {
    for (let i = this.pendingAttacks.length - 1; i >= 0; i -= 1) {
      const pendingAttack = this.pendingAttacks[i];

      if (time < pendingAttack.activeStartsAt) {
        continue;
      }

      this.pendingAttacks.splice(i, 1);

      if (this.matchOver) {
        continue;
      }

      this.createAttackHitbox(
        pendingAttack.attacker,
        pendingAttack.defender,
        pendingAttack.defenderHp,
        pendingAttack.timing,
        pendingAttack.activeStartsAt,
      );
    }
  }

  private createAttackHitbox(fighter: Fighter, opponent: Fighter, opponentHp: PlayerHp, timing: AttackTiming, time: number) {
    const effectiveAttackWidth = this.getEffectiveAttackWidth(fighter);
    const hitboxX = fighter.body.x + fighter.facing * (this.getFighterBodyHalfWidth(fighter) + effectiveAttackWidth / 2);
    const hitboxY = fighter.body.y + fighter.stats.attackYOffset;
    const attackVisualStyle = this.getAttackVisualStyle(fighter);
    const hitbox = this.add
      .rectangle(hitboxX, hitboxY, effectiveAttackWidth, fighter.stats.attackHeight, attackVisualStyle.fillColor, 0.35)
      .setStrokeStyle(2, attackVisualStyle.strokeColor)
      .setDepth(1);

    this.activeAttacks.push({
      attacker: fighter,
      defender: opponent,
      defenderHp: opponentHp,
      hitbox,
      hasHit: false,
      activeStartedAt: time,
      expiresAt: time + timing.activeMs,
    });
  }

  private updateActiveAttacks(time: number) {
    for (let i = this.activeAttacks.length - 1; i >= 0; i -= 1) {
      const attack = this.activeAttacks[i];

      if (time >= attack.expiresAt) {
        attack.hitbox.destroy();
        this.activeAttacks.splice(i, 1);
        continue;
      }

      if (this.matchOver || attack.hasHit) {
        continue;
      }

      if (Phaser.Geom.Intersects.RectangleToRectangle(attack.hitbox.getBounds(), attack.defender.body.getBounds())) {
        attack.hasHit = true;
        const damageResult = this.calculateAttackDamage(attack.attacker, attack.defender, time);

        if (damageResult.wasJustGuarded) {
          this.showJustGuardFeedback(attack.defender);
          continue;
        }

        this.applyDamage(attack.defenderHp, damageResult.damage);
        this.applyKnockback(
          attack.defender,
          attack.attacker.facing,
          this.getGuardedKnockbackSpeed(attack.defender, attack.attacker.stats.knockbackSpeed, damageResult.wasJustGuarded),
        );
        this.flashFighter(attack.defender);
        this.showHitSpark(attack.defender, attack.attacker);
        this.showHitMarker(attack.defender, damageResult.damage, damageResult.isCritical);
        this.shakeCameraOnHit();
        this.checkMatchResult();

        if (this.matchOver) {
          return;
        }
      }
    }
  }



  private shakeCameraOnHit() {
    if (this.matchOver || this.isPaused || !this.screenShakeEnabled) {
      return;
    }

    this.cameras.main.shake(hitShakeDurationMs, hitShakeIntensity);
  }

  private showHitSpark(defender: Fighter, attacker: Fighter) {
    if (this.matchOver || !this.effectsEnabled) {
      return;
    }

    const sparkColor = attacker.stats.attackStrokeColor;
    const sparkCenterX = defender.body.x + attacker.facing * 14;
    const sparkCenterY = defender.body.y - defender.body.height * 0.1;
    const sparkOffsets = [
      { x: -10, y: -4, width: 10, height: 3, angle: -28 },
      { x: -2, y: -10, width: 9, height: 3, angle: -8 },
      { x: 7, y: -2, width: 11, height: 3, angle: 22 },
      { x: 2, y: 8, width: 8, height: 2, angle: 14 },
    ];

    const sparkRects = sparkOffsets.map((offset) => this.add
      .rectangle(
        sparkCenterX + offset.x * attacker.facing,
        sparkCenterY + offset.y,
        offset.width,
        offset.height,
        sparkColor,
        0.88,
      )
      .setAngle(offset.angle * attacker.facing)
      .setDepth(7));

    this.activeHitSparks.push(...sparkRects);
    const sparkEvent = this.time.delayedCall(hitSparkDurationMs, () => {
      for (const sparkRect of sparkRects) {
        sparkRect.destroy();
      }

      this.activeHitSparks = this.activeHitSparks.filter((sparkRect) => !sparkRects.includes(sparkRect));
      this.hitSparkEvents = this.hitSparkEvents.filter((event) => event !== sparkEvent);
    });

    this.hitSparkEvents.push(sparkEvent);
  }


  private showJustGuardFeedback(defender: Fighter) {
    if (this.matchOver) {
      return;
    }

    const ring = this.add
      .ellipse(defender.body.x, defender.body.y, defender.body.width + 56, defender.body.height + 58, 0x22d3ee, 0.1)
      .setStrokeStyle(5, 0xf0fdfa, 0.92)
      .setDepth(8);
    const burst = this.add
      .ellipse(defender.body.x, defender.body.y, defender.body.width + 28, defender.body.height + 30, 0xa7f3d0, 0.22)
      .setStrokeStyle(3, 0x67e8f9, 0.88)
      .setDepth(8);

    this.activeJustGuardFeedback.push(ring, burst);
    const feedbackEvent = this.time.delayedCall(justGuardFeedbackDurationMs, () => {
      ring.destroy();
      burst.destroy();
      this.activeJustGuardFeedback = this.activeJustGuardFeedback.filter((feedback) => feedback !== ring && feedback !== burst);
      this.justGuardFeedbackEvents = this.justGuardFeedbackEvents.filter((event) => event !== feedbackEvent);
    });

    this.justGuardFeedbackEvents.push(feedbackEvent);
  }

  private showHitMarker(fighter: Fighter, damage: number, isCritical = false) {
    if (this.matchOver) {
      return;
    }

    this.hitMarker?.destroy();
    this.hitMarkerSubLabel?.destroy();
    this.hitMarkerEvent?.remove(false);
    this.hitMarker = this.add
      .text(fighter.body.x, fighter.body.y - fighter.body.height / 2 - 28, `HIT -${damage}`, {
        align: 'center',
        color: '#fef08a',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5)
      .setDepth(6);

    if (this.effectsEnabled) {
      this.hitMarkerSubLabel = this.add
        .text(fighter.body.x, fighter.body.y - fighter.body.height / 2 - 48, isCritical ? getCriticalHitLabelJa() : 'CLEAN HIT', {
          align: 'center',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
        })
        .setOrigin(0.5)
        .setDepth(6);
    }

    this.hitMarkerEvent = this.time.delayedCall(hitMarkerDurationMs, () => {
      this.hitMarker?.destroy();
      this.hitMarkerSubLabel?.destroy();
      this.hitMarker = undefined;
      this.hitMarkerSubLabel = undefined;
      this.hitMarkerEvent = undefined;
    });
  }

  private applyDamage(playerHp: PlayerHp, damage: number) {
    playerHp.current = Math.max(0, playerHp.current - damage);
    this.updateHpUi(playerHp);
  }

  private updateHpUi(playerHp: PlayerHp) {
    const hpRatio = Phaser.Math.Clamp(playerHp.current / playerHp.max, 0, 1);

    playerHp.text.setText(`${playerHp.name} HP: ${playerHp.current}/${playerHp.max}`);
    playerHp.barFill.setSize(playerHp.barMaxWidth * hpRatio, hpBarHeight - hpBarInset * 2);
  }

  private flashFighter(fighter: Fighter) {
    if (this.matchOver) {
      return;
    }

    fighter.hitFlashEvent?.remove(false);
    fighter.body.setFillStyle(hitFlashColor);
    fighter.hitFlashEvent = this.time.delayedCall(hitFlashDurationMs, () => {
      this.resetFighterColor(fighter);
    });
  }

  private resetFighterColor(fighter: Fighter) {
    fighter.hitFlashEvent?.remove(false);
    fighter.hitFlashEvent = undefined;
    fighter.body.setFillStyle(fighter.normalColor);
  }

  private applyKnockback(fighter: Fighter, direction: -1 | 1, speed: number) {
    if (this.matchOver) {
      return;
    }

    fighter.knockbackVelocity = direction * speed;
  }

  private updateKnockback(fighter: Fighter, delta: number) {
    if (this.matchOver) {
      fighter.knockbackVelocity = 0;
      return;
    }

    if (fighter.knockbackVelocity === 0) {
      return;
    }

    const deltaSeconds = delta / 1000;
    const bodyHalfWidth = this.getFighterBodyHalfWidth(fighter);
    const leftBound = bodyHalfWidth;
    const rightBound = gameWidth - bodyHalfWidth;
    const nextX = Phaser.Math.Clamp(
      fighter.body.x + fighter.knockbackVelocity * deltaSeconds,
      leftBound,
      rightBound,
    );

    fighter.body.setX(nextX);
    fighter.label.setX(nextX);

    if (nextX === leftBound || nextX === rightBound) {
      fighter.knockbackVelocity = 0;
      return;
    }

    const decayAmount = knockbackDecay * deltaSeconds;

    if (Math.abs(fighter.knockbackVelocity) <= decayAmount + knockbackStopSpeed) {
      fighter.knockbackVelocity = 0;
      return;
    }

    fighter.knockbackVelocity -= Math.sign(fighter.knockbackVelocity) * decayAmount;
  }

  private checkMatchResult() {
    const player1Defeated = this.player1Hp.current <= 0;
    const player2Defeated = this.player2Hp.current <= 0;

    if (!player1Defeated && !player2Defeated) {
      return;
    }

    const resultData = player1Defeated && player2Defeated
      ? { result: 'draw' as const, displayTitle: 'Draw', matchEndReason: 'draw' as const }
      : player1Defeated
        ? { result: 'p2' as const, displayTitle: this.player2.definition.resultWinText, matchEndReason: 'ko' as const }
        : { result: 'p1' as const, displayTitle: this.player1.definition.resultWinText, matchEndReason: 'ko' as const };

    this.endMatch(resultData);
  }

  private finishMatchByTimeUp() {
    if (this.matchOver) {
      return;
    }

    const resultData = this.getTimeUpResultData();
    this.endMatch(resultData);
  }

  private getTimeUpResultData(): ResultSceneData {
    if (this.player1Hp.current === this.player2Hp.current) {
      return { result: 'draw' as const, displayTitle: 'Draw', matchEndReason: 'time_up' as const };
    }

    return this.player1Hp.current > this.player2Hp.current
      ? { result: 'p1' as const, displayTitle: this.player1.definition.resultWinText, matchEndReason: 'time_up' as const }
      : { result: 'p2' as const, displayTitle: this.player2.definition.resultWinText, matchEndReason: 'time_up' as const };
  }

  private showWinEffect(resultData: ResultSceneData) {
    if (!this.effectsEnabled) {
      return;
    }

    const isDraw = resultData.result === 'draw';
    const accentColor = isDraw ? 0xe2e8f0 : 0xfef08a;
    const strokeColor = isDraw ? 0x94a3b8 : 0xfacc15;
    const accentLabel = isDraw ? 'DRAW' : 'WIN!';

    const bars = [
      { x: 304, y: 262, width: 26, height: 6, angle: -18 },
      { x: 340, y: 246, width: 20, height: 5, angle: -10 },
      { x: 460, y: 246, width: 20, height: 5, angle: 10 },
      { x: 496, y: 262, width: 26, height: 6, angle: 18 },
      { x: 332, y: 324, width: 22, height: 5, angle: 14 },
      { x: 468, y: 324, width: 22, height: 5, angle: -14 },
    ];

    for (const bar of bars) {
      this.add
        .rectangle(bar.x, bar.y, bar.width, bar.height, accentColor, 0.9)
        .setAngle(bar.angle)
        .setStrokeStyle(1, strokeColor)
        .setDepth(6);
    }

    this.add
      .text(400, 252, accentLabel, {
        align: 'center',
        color: isDraw ? '#e2e8f0' : '#fef08a',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5)
      .setDepth(6);
  }

  private endMatch(resultData: ResultSceneData) {
    if (this.matchOver) {
      return;
    }

    if (this.isPaused) {
      this.resumeBattle(this.time.now);
    }

    this.matchOver = true;
    this.add.rectangle(400, 292, 360, 86, 0x020617, 0.62).setStrokeStyle(3, 0xfacc15).setDepth(7);
    this.add.text(400, 292, resultData.displayTitle ?? 'Match Over', {
      align: 'center',
      color: '#facc15',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '30px',
    }).setOrigin(0.5).setDepth(8);
    this.showWinEffect(resultData);
    this.destroyPauseOverlay();
    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.pendingRetirePlayer = undefined;
    this.clearActiveAttacks();
    this.player1.knockbackVelocity = 0;
    this.player2.knockbackVelocity = 0;
    this.resultTransitionEvent = this.time.delayedCall(matchEndDelayMs, () => {
      this.resultTransitionEvent = undefined;
      this.scene.start('ResultScene', {
        ...resultData,
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });
    });
  }

  private cleanupBattleScene() {
    this.destroyPauseOverlay();
    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.pendingRetirePlayer = undefined;
    this.clearActiveAttacks();
    this.startCountdownEvent?.remove(false);
    this.startCountdownEvent = undefined;
    this.startPromptClearEvent?.remove(false);
    this.startPromptClearEvent = undefined;
    this.startPrompt?.destroy();
    this.startPrompt = undefined;
    this.hitMarkerEvent?.remove(false);
    this.hitMarkerEvent = undefined;
    this.hitMarker?.destroy();
    this.hitMarkerSubLabel?.destroy();
    this.hitMarker = undefined;
    this.hitMarkerSubLabel = undefined;
    this.matchTimerText?.destroy();
    this.matchTimerText = undefined;
    this.hitboxDebugEnabled = false;
    this.hitboxDebugKey = undefined;
    this.destroyHitboxDebugOverlay();
    this.clearHitSparks();
    this.clearJustGuardFeedback();
    this.resultTransitionEvent?.remove(false);
    this.resultTransitionEvent = undefined;
    this.player1AmpAccent?.destroy();
    this.player2AmpAccent?.destroy();
    this.player1AmpAccent = undefined;
    this.player2AmpAccent = undefined;

    if (this.player1) {
      this.player1.knockbackVelocity = 0;
      this.resetFighterColor(this.player1);
      this.clearGuardFeedback(this.player1);
      this.player1.guardIndicator?.destroy();
      this.player1.guardIndicator = undefined;
    }

    if (this.player2) {
      this.player2.knockbackVelocity = 0;
      this.resetFighterColor(this.player2);
      this.clearGuardFeedback(this.player2);
      this.player2.guardIndicator?.destroy();
      this.player2.guardIndicator = undefined;
    }
  }

  private isAmpCompatibleFighter(fighterId: string): boolean {
    return fighterId === 'electric-guitar' || fighterId === 'bass' || fighterId === 'keyboard';
  }

  private resolveBattleEquipmentIdForFighter(fighterId: string, equipmentId: EquipmentId): EquipmentId {
    // Battle-side safety fallback: stale/incompatible saved selections must resolve safely.
    if (equipmentId === 'amp' && !this.isAmpCompatibleFighter(fighterId)) {
      return 'none';
    }

    return equipmentId;
  }

  private getFighterEquipmentId(fighter: Fighter): EquipmentId {
    return fighter === this.player1 ? this.player1EquipmentId : this.player2EquipmentId;
  }

  // Phase 10 tradeoff: Drum Sticks + Case gives up attacker-side high-critical identity.
  // This does not change defender-side Case reduction behavior for non-critical hits.
  private canUseDrumSticksCritical(attacker: Fighter): boolean {
    return attacker.definition.id === 'drum-sticks' && this.getFighterEquipmentId(attacker) !== 'case';
  }

  private hasAmpReach(fighter: Fighter): boolean {
    return this.getFighterEquipmentId(fighter) === 'amp' && this.isAmpCompatibleFighter(fighter.definition.id);
  }

  private getEffectiveAttackWidth(fighter: Fighter): number {
    return fighter.stats.attackWidth + (this.hasAmpReach(fighter) ? ampAttackReachBonusPx : 0);
  }

  private isJustGuarding(defender: Fighter, time: number) {
    return defender.isGuarding &&
      defender.guardStartedAt > 0 &&
      time >= defender.guardStartedAt &&
      time - defender.guardStartedAt <= justGuardWindowMs;
  }

  private getGuardedDamage(defender: Fighter, damage: number, wasJustGuarded: boolean) {
    if (wasJustGuarded) {
      return 0;
    }

    if (!defender.isGuarding || damage <= 0) {
      return damage;
    }

    return Math.max(1, Math.floor(damage * normalGuardDamageMultiplier));
  }

  private getGuardedKnockbackSpeed(defender: Fighter, speed: number, wasJustGuarded: boolean) {
    if (wasJustGuarded) {
      return 0;
    }

    return defender.isGuarding ? speed * normalGuardKnockbackMultiplier : speed;
  }

  private calculateAttackDamage(attacker: Fighter, defender: Fighter, time: number): DamageCalculationResult {
    const baseDamage = attacker.stats.attackDamage;
    const canCritical = this.canUseDrumSticksCritical(attacker);
    const isCritical = canCritical && Math.random() < drumSticksCriticalRate;

    let finalDamage = baseDamage;

    if (isCritical) {
      finalDamage = Math.floor(baseDamage * drumSticksCriticalMultiplier);
    } else {
      const defenderEquipmentId = this.getFighterEquipmentId(defender);
      if (defenderEquipmentId === 'case') {
        finalDamage = Math.floor(baseDamage * caseNormalDamageMultiplier);
      }
    }

    const wasJustGuarded = this.isJustGuarding(defender, time);

    return {
      damage: this.getGuardedDamage(defender, Math.max(1, finalDamage), wasJustGuarded),
      isCritical,
      wasJustGuarded,
    };
  }


  private clearHitSparks() {
    for (const sparkEvent of this.hitSparkEvents) {
      sparkEvent.remove(false);
    }

    this.hitSparkEvents = [];

    for (const sparkRect of this.activeHitSparks) {
      sparkRect.destroy();
    }

    this.activeHitSparks = [];
  }


  private clearJustGuardFeedback() {
    for (const feedbackEvent of this.justGuardFeedbackEvents) {
      feedbackEvent.remove(false);
    }

    this.justGuardFeedbackEvents = [];

    for (const feedback of this.activeJustGuardFeedback) {
      feedback.destroy();
    }

    this.activeJustGuardFeedback = [];
  }

  private clearActiveAttacks() {
    this.pendingAttacks = [];

    for (const attack of this.activeAttacks) {
      attack.hitbox.destroy();
    }

    this.activeAttacks = [];
  }
}

class ResultScene extends Phaser.Scene {
  private result = 'Match Over';
  private resultKind?: ResultSceneData['result'];
  private matchEndReason: MatchEndReason = 'ko';
  private hasRecordedResult = false;
  private player1FighterId = defaultPlayer1FighterId;
  private player2FighterId = defaultPlayer2FighterId;
  private player2Mode = defaultPlayer2Mode;
  private player1EquipmentId: EquipmentId = 'none';
  private player2EquipmentId: EquipmentId = 'none';
  private player1Equipment = getEquipmentDefinition('none');
  private player2Equipment = getEquipmentDefinition('none');
  private player1Definition = defaultPlayer1FighterDefinition;
  private player2Definition = defaultPlayer2FighterDefinition;
  private restartKey?: Phaser.Input.Keyboard.Key;
  private characterSelectKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private inputEnabledAt = 0;
  private transitionStarted = false;

  constructor() {
    super('ResultScene');
  }

  init(data: ResultSceneData = {}) {
    this.hasRecordedResult = false;
    this.resultKind = data.result;
    this.matchEndReason = data.matchEndReason ?? (data.result === 'draw' ? 'draw' : 'ko');
    this.player1FighterId = data.player1FighterId ?? defaultPlayer1FighterId;
    this.player2FighterId = data.player2FighterId ?? defaultPlayer2FighterId;
    this.player2Mode = data.player2Mode ?? defaultPlayer2Mode;
    this.player1Equipment = getEquipmentDefinition(data.player1EquipmentId);
    this.player2Equipment = getEquipmentDefinition(data.player2EquipmentId);
    this.player1EquipmentId = this.player1Equipment.id;
    this.player2EquipmentId = this.player2Equipment.id;
    this.player1Definition = getFighterDefinition(this.player1FighterId);
    this.player2Definition = getFighterDefinition(this.player2FighterId);
    this.result = data.displayTitle ?? this.getDisplayTitle(data.result);
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;
    this.recordResultOnce();

    addViewportBackground(this);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const centerX = camera.scrollX + layoutWidth / 2;
    const centerY = camera.scrollY + layoutHeight / 2;
    const safeTop = camera.scrollY + uiSafeMargin;
    const panelWidth = Math.min(720, layoutWidth - uiPanelOuterMargin);
    const contentWidth = panelWidth - uiPanelContentInset;

    this.add.rectangle(centerX, centerY, panelWidth, Math.min(440, layoutHeight - uiPanelOuterMargin), 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(centerX, safeTop + 48, '試合結果', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeTop + 104, this.result, {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '42px',
        wordWrap: { width: contentWidth, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    this.add.rectangle(centerX, safeTop + 206, contentWidth, 104, 0x0f172a, 0.78).setStrokeStyle(2, 0x334155);
    this.add
      .text(centerX, safeTop + 146, `理由: ${this.getMatchEndReasonLabel()}`, {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.add.rectangle(centerX, safeTop + 206, contentWidth, 104, 0x0f172a, 0.78).setStrokeStyle(2, 0x334155);
    this.add
      .text(centerX, safeTop + 174, '対戦サマリー', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        lineSpacing: 10,
        wordWrap: { width: contentWidth - 40, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    this.add.rectangle(centerX, safeTop + 338, contentWidth, 108, 0x0f172a, 0.72).setStrokeStyle(2, 0x334155);
    this.add
      .text(centerX, safeTop + 200, [`P1: ${getFighterDisplayNameJa(this.player1FighterId)} / 装備 ${getEquipmentShortLabelJa(this.player1Equipment.id)}`, `P2: ${getFighterDisplayNameJa(this.player2FighterId)} (${this.player2Mode === 'cpu' ? 'CPU' : '2P'}) / 装備 ${getEquipmentShortLabelJa(this.player2Equipment.id)}`], {
        align: 'center',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        lineSpacing: 10,
        wordWrap: { width: contentWidth - 40, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    this.add.rectangle(centerX, safeTop + 338, contentWidth, 108, 0x0f172a, 0.72).setStrokeStyle(2, 0x334155);
    this.add
      .text(centerX, safeTop + 304, '次の操作', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, safeTop + 334, ['R: 再戦', 'C: キャラ変更（装備は維持）', 'Enter/Space: ホームへ戻る'], {
        align: 'center',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.restartKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.characterSelectKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) {
      return;
    }

    if (this.restartKey && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.transitionStarted = true;
      this.scene.start('BattleScene', {
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });
      return;
    }

    if (this.characterSelectKey && Phaser.Input.Keyboard.JustDown(this.characterSelectKey)) {
      this.transitionStarted = true;
      this.scene.start('CharacterSelectScene', {
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });
      return;
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      this.transitionStarted = true;
      this.scene.start('HomeScene');
    }
  }


  private getMatchEndReasonLabel() {
    switch (this.matchEndReason) {
      case 'time_up':
        return 'TIME UP';
      case 'retire':
        return 'RETIRE';
      case 'draw':
        return 'DRAW';
      case 'ko':
      default:
        return 'KO';
    }
  }

  private getDisplayTitle(result?: ResultSceneData['result']) {
    switch (result) {
      case 'p1':
        return `P1 ${getFighterDisplayNameJa(this.player1FighterId)} 勝利`;
      case 'p2':
        return `P2 ${getFighterDisplayNameJa(this.player2FighterId)} 勝利`;
      case 'draw':
        return '引き分け';
      default:
        return '試合終了';
    }
  }

  private recordResultOnce() {
    if (this.hasRecordedResult) {
      return;
    }

    if (this.resultKind !== 'p1' && this.resultKind !== 'p2' && this.resultKind !== 'draw') {
      return;
    }

    // matchEndReason is intentionally not recorded; v1 records stay result-only.
    this.hasRecordedResult = true;
    recordStoredMatchResult(this.resultKind, this.player2Mode);
  }
}

class RecordsScene extends Phaser.Scene {
  private selectedIndex = 0;
  private records = getDefaultStoredRecords();
  private recordsText?: Phaser.GameObjects.Text;
  private recordsLastPlayedText?: Phaser.GameObjects.Text;
  private resetRecordsText?: Phaser.GameObjects.Text;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;
  private isResetArmed = false;
  private inputEnabledAt = 0;
  private transitionStarted = false;

  constructor() {
    super('RecordsScene');
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;
    this.selectedIndex = 0;
    this.isResetArmed = false;
    this.records = loadStoredRecords();

    addViewportBackground(this);
    this.add.rectangle(400, 300, 700, 520, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 244, 640, 280, 0x0f172a).setStrokeStyle(2, 0x334155);
    this.add.rectangle(400, 474, 640, 170, 0x0f172a).setStrokeStyle(2, 0x334155);

    this.add
      .text(400, 72, '記録', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
      })
      .setOrigin(0.5);

    this.add
      .text(100, 98, 'サマリー', {
        color: '#93c5fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0, 0);

    this.recordsText = this.add
      .text(100, 122, '', {
        align: 'left',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
        lineSpacing: 11,
      })
      .setOrigin(0, 0);

    this.add
      .text(100, 340, '最終プレイ', {
        color: '#93c5fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0, 0);

    this.recordsLastPlayedText = this.add
      .text(100, 364, '', {
        align: 'left',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        wordWrap: { width: 600, useAdvancedWrap: true },
      })
      .setOrigin(0, 0);

    this.add
      .text(100, 404, '操作', {
        color: '#93c5fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0, 0);

    this.resetRecordsText = this.add
      .text(100, 428, '', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        lineSpacing: 8,
      })
      .setOrigin(0, 0);

    this.add
      .text(400, 542, '↑/↓: 選択   Enter/Space: 決定   Esc: ホームへ戻る', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.updateTexts();
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) {
      return;
    }

    if ((this.upKey && Phaser.Input.Keyboard.JustDown(this.upKey)) || (this.downKey && Phaser.Input.Keyboard.JustDown(this.downKey))) {
      this.selectedIndex = this.selectedIndex === 0 ? 1 : 0;

      if (this.selectedIndex !== 1) {
        this.isResetArmed = false;
      }

      this.updateTexts();
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      if (this.selectedIndex === 0) {
        this.transitionStarted = true;
        this.scene.start('HomeScene');
        return;
      }

      if (!this.isResetArmed) {
        this.isResetArmed = true;
      } else {
        this.records = resetStoredRecords();
        this.isResetArmed = false;
      }

      this.updateTexts();
    }

    if (this.escapeKey && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.isResetArmed = false;
      this.transitionStarted = true;
      this.scene.start('HomeScene');
    }
  }

  private updateTexts() {
    const lastPlayedRaw = this.records.lastPlayedAt ?? '未プレイ';
    const lastPlayedSafe = lastPlayedRaw.length > 56 ? `${lastPlayedRaw.slice(0, 56)}…` : lastPlayedRaw;
    this.recordsText?.setText(`試合数: ${this.records.totalMatches}
P1勝利: ${this.records.p1Wins}
P2勝利: ${this.records.p2Wins}
引き分け: ${this.records.draws}
CPU戦: ${this.records.cpuMatches}
ふたり対戦: ${this.records.local2pMatches}`);

    this.recordsLastPlayedText?.setText(lastPlayedSafe);

    const prefixHome = this.selectedIndex === 0 ? '> ' : '  ';
    const prefixReset = this.selectedIndex === 1 ? (this.isResetArmed ? '▶ ' : '> ') : '  ';
    const resetLabel = this.isResetArmed ? '記録リセット（確認中: もう一度押すと実行）' : '記録リセット';
    this.resetRecordsText?.setText(`${prefixHome}ホームへ戻る\n${prefixReset}${resetLabel}`);
  }
}



type EquipmentSelectSceneData = CharacterSelectSceneData;

class EquipmentSelectScene extends Phaser.Scene {
  private player1FighterId?: string;
  private player2FighterId?: string;
  private player2Mode: Player2Mode = defaultPlayer2Mode;
  private player1EquipmentId: EquipmentId = 'none';
  private player2EquipmentId: EquipmentId = 'none';
  private selectedEquipmentRow: 0 | 1 = 0;
  private equipmentOptions = getAllEquipmentDefinitions();
  private equipmentRowsText?: Phaser.GameObjects.Text;
  private equipmentDescriptionText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super('EquipmentSelectScene');
  }

  init(data?: EquipmentSelectSceneData) {
    this.player1FighterId = data?.player1FighterId;
    this.player2FighterId = data?.player2FighterId;
    this.player2Mode = data?.player2Mode === 'cpu' ? 'cpu' : 'human';
    this.player1EquipmentId = getEquipmentDefinition(data?.player1EquipmentId).id;
    this.player2EquipmentId = getEquipmentDefinition(data?.player2EquipmentId).id;
    this.selectedEquipmentRow = 0;
  }

  create() {
    const p1Label = this.player1FighterId ? getFighterDisplayNameJa(this.player1FighterId) : '未選択';
    const p2Label = this.player2FighterId ? getFighterDisplayNameJa(this.player2FighterId) : '未選択';

    addViewportBackground(this);

    const layoutWidth = getLayoutWidth(this);
    const layoutHeight = getLayoutHeight(this);
    const camera = this.cameras.main;
    const centerX = camera.scrollX + layoutWidth / 2;
    const centerY = camera.scrollY + layoutHeight / 2;
    const safeTop = camera.scrollY + uiSafeMargin;
    const safeBottom = camera.scrollY + layoutHeight - uiSafeMargin;
    const panelWidth = Math.min(760, layoutWidth - uiPanelOuterMargin);
    const contentLeft = centerX - panelWidth / 2 + uiPanelHorizontalPadding;
    const contentWidth = panelWidth - uiPanelContentInset;
    const descriptionY = safeTop + 316;

    this.add.rectangle(centerX, centerY, panelWidth, Math.min(520, layoutHeight - uiPanelOuterMargin), 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add.text(centerX, safeTop + 46, '装備選択', {
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '44px',
    }).setOrigin(0.5);

    this.add.rectangle(centerX, safeTop + 126, contentWidth, 74, 0x0f172a, 0.72).setStrokeStyle(2, 0x334155);
    this.add.text(contentLeft, safeTop + 102, `P1: ${p1Label}`, {
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
    }).setOrigin(0, 0);

    this.add.text(contentLeft, safeTop + 136, `P2: ${p2Label} (${this.player2Mode === 'cpu' ? 'CPU' : '2P'})`, {
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
    }).setOrigin(0, 0);

    this.add.rectangle(centerX, safeTop + 232, contentWidth, 100, 0x0f172a, 0.78).setStrokeStyle(2, 0x475569);
    this.equipmentRowsText = this.add.text(contentLeft, safeTop + 198, '', {
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px',
      lineSpacing: 14,
      align: 'left',
    }).setOrigin(0, 0);

    this.add.rectangle(centerX, descriptionY + 32, contentWidth, 112, 0x0f172a, 0.72).setStrokeStyle(2, 0x334155);
    this.equipmentDescriptionText = this.add.text(centerX, descriptionY, '', {
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: contentWidth - 40, useAdvancedWrap: true },
    }).setOrigin(0.5, 0);

    this.statusText = this.add.text(centerX, safeTop + 422, '', {
      color: '#94a3b8',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(centerX, safeBottom - 34, ['↑/↓: P1/P2切替   ←/→: 装備変更', 'Enter/Space: 決定   Esc: 戻る'], {
      color: '#facc15',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.updateEquipmentTexts();
  }

  update() {
    if ((this.upKey && Phaser.Input.Keyboard.JustDown(this.upKey)) || (this.downKey && Phaser.Input.Keyboard.JustDown(this.downKey))) {
      this.selectedEquipmentRow = this.selectedEquipmentRow === 0 ? 1 : 0;
      this.updateEquipmentTexts();
    }

    if (this.leftKey && Phaser.Input.Keyboard.JustDown(this.leftKey)) {
      this.cycleEquipment(-1);
    }

    if (this.rightKey && Phaser.Input.Keyboard.JustDown(this.rightKey)) {
      this.cycleEquipment(1);
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      saveLastSelected({
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });

      this.scene.start('BattleScene', {
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });
      return;
    }

    if (this.escapeKey && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.scene.start('CharacterSelectScene', {
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
        player1EquipmentId: this.player1EquipmentId,
        player2EquipmentId: this.player2EquipmentId,
      });
    }
  }

  private cycleEquipment(direction: -1 | 1) {
    const current = this.selectedEquipmentRow === 0 ? this.player1EquipmentId : this.player2EquipmentId;
    const currentIndex = Math.max(0, this.equipmentOptions.findIndex((definition) => definition.id === current));
    const nextIndex = (currentIndex + direction + this.equipmentOptions.length) % this.equipmentOptions.length;
    const nextEquipmentId = this.equipmentOptions[nextIndex].id;

    if (this.selectedEquipmentRow === 0) {
      this.player1EquipmentId = nextEquipmentId;
    } else {
      this.player2EquipmentId = nextEquipmentId;
    }

    this.updateEquipmentTexts();
  }

  private updateEquipmentTexts() {
    const p1Equipment = getEquipmentDefinition(this.player1EquipmentId);
    const p2Equipment = getEquipmentDefinition(this.player2EquipmentId);
    const focusedEquipment = this.selectedEquipmentRow === 0 ? p1Equipment : p2Equipment;
    const focusedFighterId = this.selectedEquipmentRow === 0 ? this.player1FighterId : this.player2FighterId;
    const p1Prefix = this.selectedEquipmentRow === 0 ? '> ' : '  ';
    const p2Prefix = this.selectedEquipmentRow === 1 ? '> ' : '  ';
    const ampIncompatibleNote =
      focusedEquipment.id === 'amp' && focusedFighterId === 'drum-sticks'
        ? '\nドラムスティックはアンプ非対応。バトルでは装備なし扱い。'
        : '';

    this.equipmentRowsText?.setText(
      `${p1Prefix}P1装備: ${getEquipmentShortLabelJa(p1Equipment.id)}
${p2Prefix}P2装備: ${getEquipmentShortLabelJa(p2Equipment.id)}`,
    );
    this.equipmentDescriptionText?.setText(
      `${getEquipmentDisplayNameJa(focusedEquipment.id)}: ${getEquipmentDescriptionJa(focusedEquipment.id)}${ampIncompatibleNote}`,
    );
    this.statusText?.setText(`${this.selectedEquipmentRow === 0 ? 'P1' : 'P2'}の装備を選択中`);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: getInitialLayoutWidth(),
  height: getInitialLayoutHeight(),
  backgroundColor: '#111827',
  scale: {
    mode: Phaser.Scale.RESIZE,
    min: {
      width: gameWidth,
      height: gameHeight,
    },
  },
  scene: [HomeScene, OptionsScene, RecordsScene, ModeSelectScene, CharacterSelectScene, EquipmentSelectScene, BattleScene, ResultScene],
});
