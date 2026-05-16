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
const hpBarWidth = 220;
const hpBarHeight = 18;
const hpBarInset = 3;
const cpuAttackDistancePadding = 18;
const cpuComfortDistance = 172;
const cpuDecisionIntervalMs = 850;
const cpuRetreatDurationMs = 420;
const cpuRetreatChance = 0.22;

type Player2Mode = 'human' | 'cpu';

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
};

type CharacterSelectSceneData = BattleSceneData;

type ResultSceneData = BattleSceneData & {
  result?: 'p1' | 'p2' | 'draw';
  displayTitle?: string;
};


class HomeScene extends Phaser.Scene {
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
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
      .text(400, 178, 'A silly local 1v1 instrument fighting prototype', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    this.add
      .text(
        400,
        260,
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
      .text(400, 396, 'Press Enter or Space to select fighters', {
        color: '#facc15',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return;
    }

    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time: number) {
    if (this.transitionStarted || time < this.inputEnabledAt) {
      return;
    }

    if (
      (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) ||
      (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))
    ) {
      this.transitionStarted = true;
      this.scene.start('CharacterSelectScene');
    }
  }
}

class CharacterSelectScene extends Phaser.Scene {
  private player1FighterId = defaultPlayer1FighterId;
  private player2FighterId = defaultPlayer2FighterId;
  private player2Mode = defaultPlayer2Mode;
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
    this.player1FighterId = data.player1FighterId ?? defaultPlayer1FighterId;
    this.player2FighterId = data.player2FighterId ?? defaultPlayer2FighterId;
    this.player2Mode = data.player2Mode ?? defaultPlayer2Mode;
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
      .text(400, 128, `${fighterDefinitions.length} fighters available`, {
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
      .text(400, 474, 'P1: A / D choose    P2: ← / → choose    P2 ↓: Human / CPU', {
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);
    this.add
      .text(400, 520, 'Enter or Space: start battle    Esc: return Home', {
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
      this.transitionStarted = true;
      this.scene.start('BattleScene', {
        player1FighterId: fighterDefinitions[this.player1Index].id,
        player2FighterId: fighterDefinitions[this.player2Index].id,
        player2Mode: this.player2Mode,
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
    this.player2ModeText?.setText(`Mode: ${this.getPlayer2ModeLabel()}`);
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
  private player1Definition = defaultPlayer1FighterDefinition;
  private player2Definition = defaultPlayer2FighterDefinition;
  private matchOver = false;
  private matchStarted = false;
  private startPrompt?: Phaser.GameObjects.Text;
  private startCountdownEvent?: Phaser.Time.TimerEvent;
  private startPromptClearEvent?: Phaser.Time.TimerEvent;
  private resultTransitionEvent?: Phaser.Time.TimerEvent;
  private nextCpuDecisionAt = 0;
  private cpuRetreatUntil = 0;
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
  }

  create() {
    this.matchOver = false;
    this.matchStarted = false;
    this.activeAttacks = [];
    this.nextCpuDecisionAt = 0;
    this.cpuRetreatUntil = 0;
    this.startCountdownEvent?.remove(false);
    this.startCountdownEvent = undefined;
    this.startPromptClearEvent?.remove(false);
    this.startPromptClearEvent = undefined;
    this.resultTransitionEvent?.remove(false);
    this.resultTransitionEvent = undefined;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupBattleScene, this);

    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 360, 720, 260, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 500, 680, 40, 0x334155);

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
      .text(400, 150, this.player2Mode === 'cpu' ? 'P1: A / D move, W / Space attack    P2: CPU' : 'P1: A / D move, W / Space attack    P2: ← / → move, ↑ / Enter attack', {
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

    if (this.matchOver || !this.matchStarted) {
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
    }) as Record<string, Phaser.Input.Keyboard.Key>;

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

  private createAttackHitbox(fighter: Fighter, opponent: Fighter, opponentHp: PlayerHp, time: number) {
    const hitboxX = fighter.body.x + fighter.facing * (this.getFighterBodyHalfWidth(fighter) + fighter.stats.attackWidth / 2);
    const hitboxY = fighter.body.y + fighter.stats.attackYOffset;
    const hitbox = this.add
      .rectangle(hitboxX, hitboxY, fighter.stats.attackWidth, fighter.stats.attackHeight, fighter.stats.attackColor, 0.35)
      .setStrokeStyle(2, fighter.stats.attackStrokeColor)
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
        this.checkMatchResult();

        if (this.matchOver) {
          return;
        }
      }
    }
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

  private endMatch(resultData: ResultSceneData) {
    if (this.matchOver) {
      return;
    }

    this.matchOver = true;
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
      });
    });
  }

  private cleanupBattleScene() {
    this.clearActiveAttacks();
    this.startCountdownEvent?.remove(false);
    this.startCountdownEvent = undefined;
    this.startPromptClearEvent?.remove(false);
    this.startPromptClearEvent = undefined;
    this.startPrompt?.destroy();
    this.startPrompt = undefined;
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

  private clearActiveAttacks() {
    for (const attack of this.activeAttacks) {
      attack.hitbox.destroy();
    }

    this.activeAttacks = [];
  }
}

class ResultScene extends Phaser.Scene {
  private result = 'Match Over';
  private player1FighterId = defaultPlayer1FighterId;
  private player2FighterId = defaultPlayer2FighterId;
  private player2Mode = defaultPlayer2Mode;
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
    this.player1FighterId = data.player1FighterId ?? defaultPlayer1FighterId;
    this.player2FighterId = data.player2FighterId ?? defaultPlayer2FighterId;
    this.player2Mode = data.player2Mode ?? defaultPlayer2Mode;
    this.player1Definition = getFighterDefinition(this.player1FighterId);
    this.player2Definition = getFighterDefinition(this.player2FighterId);
    this.result = data.displayTitle ?? this.getDisplayTitle(data.result);
  }

  create() {
    this.inputEnabledAt = this.time.now + 150;
    this.transitionStarted = false;

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
      .text(400, 210, this.result, {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '48px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 262, `P2 Mode: ${this.player2Mode === 'cpu' ? 'CPU' : 'Human'}`, {
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
      .text(400, 352, 'Press C to change fighters', {
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
      });
      return;
    }

    if (this.characterSelectKey && Phaser.Input.Keyboard.JustDown(this.characterSelectKey)) {
      this.transitionStarted = true;
      this.scene.start('CharacterSelectScene', {
        player1FighterId: this.player1FighterId,
        player2FighterId: this.player2FighterId,
        player2Mode: this.player2Mode,
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
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: gameWidth,
  height: gameHeight,
  backgroundColor: '#111827',
  scene: [HomeScene, CharacterSelectScene, BattleScene, ResultScene],
});
