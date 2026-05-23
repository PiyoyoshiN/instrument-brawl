import Phaser from 'phaser';

const gameWidth = 800;
const gameHeight = 600;
const defaultFighterBodyWidth = 72;
const defaultFighterBodyHeight = 120;
const player1StartX = 240;
const player2StartX = 560;
const attackDurationMs = 180;
const attackCooldownMs = 240;
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
  normalColor: number;
  stats: FighterStats;
  definition: FighterDefinition;
  hitFlashEvent?: Phaser.Time.TimerEvent;
};

type PlayerControls = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  attacks: Phaser.Input.Keyboard.Key[];
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

type ActiveAttack = {
  attacker: Fighter;
  defender: Fighter;
  defenderHp: PlayerHp;
  hitbox: Phaser.GameObjects.Rectangle;
  hasHit: boolean;
  expiresAt: number;
};
type BattleSceneData = {
  player1FighterId?: string;
  player2FighterId?: string;
  player2Mode?: Player2Mode;
  player1EquipmentId?: EquipmentId;
  player2EquipmentId?: EquipmentId;
};

type CharacterSelectSceneData = BattleSceneData;

type ResultSceneData = BattleSceneData & {
  result?: 'p1' | 'p2' | 'draw';
  displayTitle?: string;
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

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 680, 420, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(400, 120, 'Instrument Brawl', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '48px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 178, 'Local 2P or P1 vs CPU instrument battles', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 220, '4 fighters • Local 2P default • Optional P2 CPU', {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add
      .text(
        400,
        292,
        `P1 ${defaultPlayer1FighterDefinition.displayName}: A / D move, W / Space attack
P2 ${defaultPlayer2FighterDefinition.displayName}: ← / → move, ↑ / Enter attack`,
        {
          align: 'center',
          color: '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '20px',
          lineSpacing: 10,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(400, 392, '← / → / ↑ / ↓ : choose', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.startCard = this.add.rectangle(220, 442, 180, 76, 0x0f172a).setStrokeStyle(4, 0xfacc15);
    this.recordsCard = this.add.rectangle(400, 442, 180, 76, 0x0f172a).setStrokeStyle(3, 0x475569);
    this.optionsCard = this.add.rectangle(580, 442, 180, 76, 0x0f172a).setStrokeStyle(3, 0x475569);
    this.add
      .text(220, 442, 'Start', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);
    this.add
      .text(400, 442, 'Records', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);
    this.add
      .text(580, 442, 'Options', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 500, 'Enter / Space: confirm', {
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

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 680, 420, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add.text(400, 120, 'Options', { color: '#ffffff', fontFamily: 'system-ui, sans-serif', fontSize: '44px' }).setOrigin(0.5);
    this.add.text(400, 176, 'Lightweight local preferences', { color: '#cbd5e1', fontFamily: 'system-ui, sans-serif', fontSize: '22px' }).setOrigin(0.5);

    this.effectsText = this.add.text(400, 260, '', { color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '30px' }).setOrigin(0.5);
    this.screenShakeText = this.add.text(400, 320, '', { color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '30px' }).setOrigin(0.5);
    this.resetPreferencesText = this.add.text(400, 380, '', { color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '30px' }).setOrigin(0.5);

    this.add.text(400, 438, '↑ / ↓: choose    ← / → or Enter / Space: toggle/confirm', { color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', fontSize: '18px' }).setOrigin(0.5);
    this.add.text(400, 470, 'Esc: return Home', { color: '#facc15', fontFamily: 'system-ui, sans-serif', fontSize: '22px' }).setOrigin(0.5);

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
    const prefixA = this.selectedIndex === 0 ? '> ' : '  ';
    const prefixB = this.selectedIndex === 1 ? '> ' : '  ';
    const prefixC = this.selectedIndex === 2 ? '> ' : '  ';
    const resetText = this.isResetArmed ? 'Reset Preferences: Press again to confirm' : 'Reset Preferences';
    this.effectsText?.setText(`${prefixA}Effects: ${this.effectsEnabled ? 'ON' : 'OFF'}`);
    this.screenShakeText?.setText(`${prefixB}Screen Shake: ${this.screenShakeEnabled ? 'ON' : 'OFF'}`);
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

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 680, 420, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(400, 120, 'Mode Select', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 176, 'Choose your match mode', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.local2pButton = this.add.rectangle(400, 286, 440, 118, 0x0f172a).setStrokeStyle(4, 0xfacc15);
    this.cpuButton = this.add.rectangle(400, 432, 440, 118, 0x0f172a).setStrokeStyle(3, 0x475569);

    this.add
      .text(400, 266, 'VS HUMAN', {
        align: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '40px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 312, 'Local 2P', {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 412, 'VS CPU', {
        align: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '40px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 458, 'P1 vs CPU', {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 528, '↑ / ↓ : choose mode', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '19px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 558, 'Enter / Space: confirm    Esc: return Home', {
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
    this.player1EquipmentId = getEquipmentDefinition(data.player1EquipmentId).id;
    this.player2EquipmentId = getEquipmentDefinition(data.player2EquipmentId).id;
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;
    this.player1Index = this.getFighterIndex(this.player1FighterId, defaultPlayer1FighterId);
    this.player2Index = this.getFighterIndex(this.player2FighterId, defaultPlayer2FighterId);

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 700, 460, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(400, 92, 'Character Select', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 128, `${fighterDefinitions.length} fighters available • same fighter OK`, {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.add.rectangle(230, 292, 270, 290, 0x0f172a).setStrokeStyle(4, 0xf97316);
    this.add.rectangle(570, 292, 270, 290, 0x0f172a).setStrokeStyle(4, 0x38bdf8);

    this.add
      .text(230, 168, 'P1', {
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
      })
      .setOrigin(0.5);
    this.add
      .text(570, 168, 'P2', {
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
      })
      .setOrigin(0.5);

    this.add
      .text(230, 206, 'Selected', {
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(0.5);
    this.add
      .text(570, 206, 'Selected', {
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      })
      .setOrigin(0.5);

    this.player1NameText = this.add
      .text(230, 242, '', {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);
    this.player1IndexText = this.add
      .text(230, 272, '', {
        align: 'center',
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.player1RoleText = this.add
      .text(230, 318, '', {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        wordWrap: { width: 230 },
      })
      .setOrigin(0.5);
    this.player1StatsText = this.add
      .text(230, 382, '', {
        align: 'left',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        lineSpacing: 4,
      })
      .setOrigin(0.5);
    this.player2NameText = this.add
      .text(570, 242, '', {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);
    this.player2IndexText = this.add
      .text(570, 272, '', {
        align: 'center',
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.player2ModeText = this.add
      .text(570, 292, '', {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.player2RoleText = this.add
      .text(570, 318, '', {
        align: 'center',
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        wordWrap: { width: 230 },
      })
      .setOrigin(0.5);
    this.player2StatsText = this.add
      .text(570, 382, '', {
        align: 'left',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        lineSpacing: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 474, 'P1: A / D choose    P2: ← / → choose    P2 ↓ toggles Human / CPU', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);
    this.add
      .text(400, 520, 'Enter / Space: start battle    Esc: return Home', {
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

    this.player1NameText?.setText(`< ${player1Definition.displayName} >`);
    this.player1IndexText?.setText(`Fighter ${this.player1Index + 1} / ${fighterDefinitions.length}`);
    this.player1RoleText?.setText(player1Definition.role);
    this.player1StatsText?.setText(this.getStatsText(player1Definition));
    this.player2NameText?.setText(`< ${player2Definition.displayName} >`);
    this.player2IndexText?.setText(`Fighter ${this.player2Index + 1} / ${fighterDefinitions.length}`);
    this.player2ModeText?.setText(`P2 Mode: ${this.getPlayer2ModeLabel()} (↓)`);
    this.player2RoleText?.setText(player2Definition.role);
    this.player2StatsText?.setText(this.getStatsText(player2Definition));
  }

  private getPlayer2ModeLabel() {
    return this.player2Mode === 'cpu' ? 'CPU' : 'Human';
  }

  private getStatsText(definition: FighterDefinition) {
    return `HP: ${definition.stats.maxHp}
Speed: ${definition.stats.moveSpeed}
Damage: ${definition.stats.attackDamage}
Knockback: ${definition.stats.knockbackSpeed}`;
  }
}

class BattleScene extends Phaser.Scene {
  private player1!: Fighter;
  private player2!: Fighter;
  private player1Hp!: PlayerHp;
  private player2Hp!: PlayerHp;
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
  private startPrompt?: Phaser.GameObjects.Text;
  private startCountdownEvent?: Phaser.Time.TimerEvent;
  private startPromptClearEvent?: Phaser.Time.TimerEvent;
  private resultTransitionEvent?: Phaser.Time.TimerEvent;
  private pauseOverlay?: Phaser.GameObjects.Container;
  private pauseKey?: Phaser.Input.Keyboard.Key;
  private isPaused = false;
  private pauseStartedAt = 0;
  private hitMarker?: Phaser.GameObjects.Text;
  private hitMarkerSubLabel?: Phaser.GameObjects.Text;
  private hitMarkerEvent?: Phaser.Time.TimerEvent;
  private activeHitSparks: Phaser.GameObjects.Rectangle[] = [];
  private hitSparkEvents: Phaser.Time.TimerEvent[] = [];
  private nextCpuDecisionAt = 0;
  private cpuRetreatUntil = 0;
  private effectsEnabled = true;
  private screenShakeEnabled = true;
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
    this.player1Equipment = getEquipmentDefinition(data.player1EquipmentId);
    this.player2Equipment = getEquipmentDefinition(data.player2EquipmentId);
    this.player1EquipmentId = this.player1Equipment.id;
    this.player2EquipmentId = this.player2Equipment.id;
    this.player1Definition = getFighterDefinition(this.player1FighterId);
    this.player2Definition = getFighterDefinition(this.player2FighterId);
  }

  create() {
    this.matchOver = false;
    this.matchStarted = false;
    this.activeAttacks = [];
    this.nextCpuDecisionAt = 0;
    this.cpuRetreatUntil = 0;
    const stored = loadStoredSettings();
    this.effectsEnabled = stored.preferences.effectsEnabled;
    this.screenShakeEnabled = stored.preferences.screenShakeEnabled;
    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.pauseKey = undefined;
    this.destroyPauseOverlay();
    this.startCountdownEvent?.remove(false);
    this.startCountdownEvent = undefined;
    this.startPromptClearEvent?.remove(false);
    this.startPromptClearEvent = undefined;
    this.resultTransitionEvent?.remove(false);
    this.resultTransitionEvent = undefined;
    this.clearHitSparks();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupBattleScene, this);

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 360, 720, 260, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 286, 660, 4, 0x334155, 0.7);
    this.add.rectangle(400, 392, 660, 4, 0x334155, 0.45);
    this.add.rectangle(400, 468, 660, 3, 0x475569, 0.55);
    this.add.rectangle(400, 500, 680, 44, 0x334155);
    this.add.rectangle(400, 480, 680, 5, 0x94a3b8, 0.45);
    this.add.rectangle(400, 506, 18, 32, 0x475569, 0.55);
    this.add.rectangle(player1StartX, 516, 132, 10, 0x0f172a, 0.42);
    this.add.rectangle(player2StartX, 516, 132, 10, 0x0f172a, 0.42);

    this.player1Hp = this.createHpUi(
      32,
      24,
      'P1',
      this.player1Definition.stats.maxHp,
      this.player1Definition.labelColor,
      0x22c55e,
      0,
    );
    this.player2Hp = this.createHpUi(
      768,
      24,
      this.player2Mode === 'cpu' ? 'P2 CPU' : 'P2',
      this.player2Definition.stats.maxHp,
      this.player2Definition.labelColor,
      0x38bdf8,
      1,
    );

    this.add
      .text(400, 64, 'Instrument Brawl', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '40px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 112, `${this.player1Definition.displayName} vs ${this.player2Definition.displayName}${this.player2Mode === 'cpu' ? ' (CPU)' : ''}`, {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 150, this.player2Mode === 'cpu' ? 'P1: A / D move, W / Space attack    P2: CPU    P: pause/help' : 'P1: A / D move, W / Space attack    P2: ← / → move, ↑ / Enter attack    P: pause/help', {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.player1 = this.createFighter(player1StartX, 'P1', this.player1Definition);
    this.player2 = this.createFighter(player2StartX, 'P2', this.player2Definition);
    this.player2.facing = -1;
    this.controls = this.createControls();
    this.showMatchStartPrompt();
  }

  update(time: number, delta: number) {
    if (!this.controls) {
      return;
    }

    if (this.pauseKey && !this.matchOver && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause(time);
    }

    if (this.isPaused || this.matchOver || !this.matchStarted) {
      return;
    }

    this.moveFighter(this.player1, this.controls.player1, delta);
    this.tryAttack(this.player1, this.controls.player1, time);

    if (this.player2Mode === 'cpu') {
      this.updateCpu(time, delta);
    } else {
      this.moveFighter(this.player2, this.controls.player2, delta);
      this.tryAttack(this.player2, this.controls.player2, time);
    }
    this.updateActiveAttacks(time);
    this.updateKnockback(this.player1, delta);
    this.updateKnockback(this.player2, delta);
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

    return {
      body,
      label: labelText,
      facing: 1,
      nextAttackAt: 0,
      knockbackVelocity: 0,
      normalColor: definition.bodyColor,
      stats: definition.stats,
      definition,
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
      player2Left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      player2Right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      player2Attack: Phaser.Input.Keyboard.KeyCodes.UP,
      player2AltAttack: Phaser.Input.Keyboard.KeyCodes.ENTER,
      pause: Phaser.Input.Keyboard.KeyCodes.P,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.pauseKey = keys.pause;

    return {
      player1: {
        left: keys.player1Left,
        right: keys.player1Right,
        attacks: [keys.player1Attack, keys.player1AltAttack],
      },
      player2: {
        left: keys.player2Left,
        right: keys.player2Right,
        attacks: [keys.player2Attack, keys.player2AltAttack],
      },
    };
  }

  private togglePause(time: number) {
    if (this.isPaused) {
      this.resumeBattle(time);
      return;
    }

    this.pauseBattle(time);
  }

  private pauseBattle(time: number) {
    this.isPaused = true;
    this.pauseStartedAt = time;
    this.setPausableTimersPaused(true);
    this.showPauseOverlay();
  }

  private resumeBattle(time: number) {
    const pausedDuration = Math.max(0, time - this.pauseStartedAt);

    this.isPaused = false;
    this.pauseStartedAt = 0;
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

    for (const attack of this.activeAttacks) {
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

    const overlay = this.add.container(400, 300).setDepth(20);
    const currentMode = this.player2Mode === 'cpu' ? 'CPU' : 'Human';

    overlay.add([
      this.add.rectangle(0, 0, gameWidth, gameHeight, 0x020617, 0.7),
      this.add.rectangle(0, 0, 620, 380, 0x111827, 0.95).setStrokeStyle(4, 0xfacc15),
      this.add.text(0, -156, 'Paused / Quick Help', {
        align: 'center',
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '32px',
      }).setOrigin(0.5),
      this.add.text(-260, -104, [
        'Resume: P',
        'P1: A / D move, W / Space attack',
        'P2 Human: Left / Right move, Up / Enter attack',
        'P2 CPU: controlled automatically',
        `Current P2 mode: ${currentMode}`,
        'Rule: one attack can hit only once',
        'Ready / Fight: controls start after Fight',
        'Result: R rematch, C character select, Enter / Space Home',
      ], {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        lineSpacing: 10,
      }).setOrigin(0, 0),
    ]);

    this.pauseOverlay = overlay;
  }

  private destroyPauseOverlay() {
    this.pauseOverlay?.destroy(true);
    this.pauseOverlay = undefined;
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

    const distance = fighter.stats.moveSpeed * (delta / 1000);
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

    if (!wantsAttack || time < fighter.nextAttackAt) {
      return;
    }

    this.startAttack(fighter, time);
  }

  private startAttack(fighter: Fighter, time: number) {
    if (this.matchOver || time < fighter.nextAttackAt) {
      return;
    }

    fighter.nextAttackAt = time + attackCooldownMs;
    const opponent = fighter === this.player1 ? this.player2 : this.player1;
    const opponentHp = fighter === this.player1 ? this.player2Hp : this.player1Hp;

    this.createAttackHitbox(fighter, opponent, opponentHp, time);
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
      this.player2.stats.attackWidth +
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

  private createAttackHitbox(fighter: Fighter, opponent: Fighter, opponentHp: PlayerHp, time: number) {
    const hitboxX = fighter.body.x + fighter.facing * (this.getFighterBodyHalfWidth(fighter) + fighter.stats.attackWidth / 2);
    const hitboxY = fighter.body.y + fighter.stats.attackYOffset;
    const attackVisualStyle = this.getAttackVisualStyle(fighter);
    const hitbox = this.add
      .rectangle(hitboxX, hitboxY, fighter.stats.attackWidth, fighter.stats.attackHeight, attackVisualStyle.fillColor, 0.35)
      .setStrokeStyle(2, attackVisualStyle.strokeColor)
      .setDepth(1);

    this.activeAttacks.push({
      attacker: fighter,
      defender: opponent,
      defenderHp: opponentHp,
      hitbox,
      hasHit: false,
      expiresAt: time + attackDurationMs,
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
        this.applyDamage(attack.defenderHp, attack.attacker.stats.attackDamage);
        this.applyKnockback(attack.defender, attack.attacker.facing, attack.attacker.stats.knockbackSpeed);
        this.flashFighter(attack.defender);
        this.showHitSpark(attack.defender, attack.attacker);
        this.showHitMarker(attack.defender, attack.attacker.stats.attackDamage);
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

  private showHitMarker(fighter: Fighter, damage: number) {
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
        .text(fighter.body.x, fighter.body.y - fighter.body.height / 2 - 48, 'CLEAN HIT', {
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
      ? { result: 'draw' as const, displayTitle: 'Draw' }
      : player1Defeated
        ? { result: 'p2' as const, displayTitle: this.player2.definition.resultWinText }
        : { result: 'p1' as const, displayTitle: this.player1.definition.resultWinText };

    this.endMatch(resultData);
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
    this.clearHitSparks();
    this.resultTransitionEvent?.remove(false);
    this.resultTransitionEvent = undefined;

    if (this.player1) {
      this.player1.knockbackVelocity = 0;
      this.resetFighterColor(this.player1);
    }

    if (this.player2) {
      this.player2.knockbackVelocity = 0;
      this.resetFighterColor(this.player2);
    }
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

  private clearActiveAttacks() {
    for (const attack of this.activeAttacks) {
      attack.hitbox.destroy();
    }

    this.activeAttacks = [];
  }
}

class ResultScene extends Phaser.Scene {
  private result = 'Match Over';
  private resultKind?: ResultSceneData['result'];
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

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 620, 360, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(400, 132, 'Match Result', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 174, 'Match finished', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 216, this.result, {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '48px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 262, `${this.player1Definition.displayName} vs ${this.player2Definition.displayName} • P2 ${this.player2Mode === 'cpu' ? 'CPU' : 'Human'}`, {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 304, 'Press R to rematch', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '26px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 352, 'Press C to change fighters (keeps picks)', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 400, 'Press Enter or Space to return to Home', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
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

  private getDisplayTitle(result?: ResultSceneData['result']) {
    switch (result) {
      case 'p1':
        return this.player1Definition.resultWinText;
      case 'p2':
        return this.player2Definition.resultWinText;
      case 'draw':
        return 'Draw';
      default:
        return 'Match Over';
    }
  }

  private recordResultOnce() {
    if (this.hasRecordedResult) {
      return;
    }

    if (this.resultKind !== 'p1' && this.resultKind !== 'p2' && this.resultKind !== 'draw') {
      return;
    }

    this.hasRecordedResult = true;
    recordStoredMatchResult(this.resultKind, this.player2Mode);
  }
}

class RecordsScene extends Phaser.Scene {
  private selectedIndex = 0;
  private records = getDefaultStoredRecords();
  private recordsText?: Phaser.GameObjects.Text;
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

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 700, 500, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add
      .text(400, 96, 'Records', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '44px',
      })
      .setOrigin(0.5);

    this.recordsText = this.add
      .text(400, 168, '', {
        align: 'left',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        lineSpacing: 12,
      })
      .setOrigin(0.5, 0);

    this.resetRecordsText = this.add
      .text(400, 428, '', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '30px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 476, '↑ / ↓: choose    Enter / Space: confirm', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 506, 'Esc: return Home', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
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
    const lastPlayedLabel = this.records.lastPlayedAt ?? 'Never';
    this.recordsText?.setText(`Total Matches: ${this.records.totalMatches}
P1 Wins: ${this.records.p1Wins}
P2 Wins: ${this.records.p2Wins}
Draws: ${this.records.draws}
VS CPU Matches: ${this.records.cpuMatches}
Local 2P Matches: ${this.records.local2pMatches}
Last Played: ${lastPlayedLabel}`);

    const prefixHome = this.selectedIndex === 0 ? '> ' : '  ';
    const prefixReset = this.selectedIndex === 1 ? '> ' : '  ';
    const resetLabel = this.isResetArmed ? 'Reset Records: Press again to confirm' : 'Reset Records';
    this.resetRecordsText?.setText(`${prefixHome}Return Home\n${prefixReset}${resetLabel}`);
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
    const p1Label = this.player1FighterId ? getFighterDefinition(this.player1FighterId).displayName : 'Not selected';
    const p2Label = this.player2FighterId ? getFighterDefinition(this.player2FighterId).displayName : 'Not selected';

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 300, 720, 500, 0x1e293b).setStrokeStyle(4, 0x475569);

    this.add.text(400, 96, 'Equipment Select', {
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '44px',
    }).setOrigin(0.5);

    this.add.text(400, 156, `P1 Fighter: ${p1Label}`, {
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
    }).setOrigin(0.5);

    this.add.text(400, 190, `P2 Fighter: ${p2Label} (${this.player2Mode === 'cpu' ? 'CPU' : 'Human'})`, {
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
    }).setOrigin(0.5);

    this.equipmentRowsText = this.add.text(400, 258, '', {
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '30px',
      lineSpacing: 14,
      align: 'left',
    }).setOrigin(0.5, 0);

    this.equipmentDescriptionText = this.add.text(400, 360, '', {
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      align: 'center',
    }).setOrigin(0.5);

    this.statusText = this.add.text(400, 394, 'Equipment handoff is coming next.', {
      color: '#94a3b8',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(400, 500, 'Up/Down: Row   Left/Right: Equipment   Enter/Space: Continue   Esc: Back', {
      color: '#facc15',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      align: 'center',
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
    const p1Prefix = this.selectedEquipmentRow === 0 ? '> ' : '  ';
    const p2Prefix = this.selectedEquipmentRow === 1 ? '> ' : '  ';

    this.equipmentRowsText?.setText(
      `${p1Prefix}P1 Equipment: ${p1Equipment.shortLabel}
${p2Prefix}P2 Equipment: ${p2Equipment.shortLabel}`,
    );
    this.equipmentDescriptionText?.setText(
      `${focusedEquipment.displayName}: ${focusedEquipment.description}`,
    );
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: gameWidth,
  height: gameHeight,
  backgroundColor: '#111827',
  scene: [HomeScene, OptionsScene, RecordsScene, ModeSelectScene, CharacterSelectScene, EquipmentSelectScene, BattleScene, ResultScene],
});
