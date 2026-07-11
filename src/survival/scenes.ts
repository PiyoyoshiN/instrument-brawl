import Phaser from 'phaser';
import {
  bankRunRewards,
  buyCommonUpgrade,
  buySpecialtyUpgrade,
  commonUpgradeDefinitions,
  getCommonUpgradeCost,
  getSpecialtyCost,
  getTotalLevel,
  instrumentById,
  instrumentDefinitions,
  isSpecialBattleUnlocked,
  loadSurvivalProgress,
  setSelectedInstrument,
  type InstrumentId,
  type MaterialId,
  type SurvivalProgress,
  type SurvivalRunRewards,
} from './progression';

const worldWidth = 2400;
const worldHeight = 1600;
const minWidth = 800;
const minHeight = 600;

function viewport(scene: Phaser.Scene, color = 0x07111f) {
  const width = Math.max(minWidth, scene.scale.width);
  const height = Math.max(minHeight, scene.scale.height);
  scene.cameras.main.setScroll((minWidth - width) / 2, (minHeight - height) / 2);
  scene.cameras.main.setBackgroundColor(color);
  scene.add.rectangle(scene.cameras.main.worldView.centerX, scene.cameras.main.worldView.centerY, width, height, color);
}

function addText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string | string[],
  size = 20,
  color = '#e2e8f0',
  align: 'left' | 'center' | 'right' = 'left',
) {
  return scene.add.text(x, y, text, {
    color,
    fontFamily: 'system-ui, sans-serif',
    fontSize: `${size}px`,
    align,
    lineSpacing: 6,
  });
}

function justDown(key?: Phaser.Input.Keyboard.Key) {
  return Boolean(key && Phaser.Input.Keyboard.JustDown(key));
}

export class SurvivalHubScene extends Phaser.Scene {
  private progress: SurvivalProgress = loadSurvivalProgress();
  private instrumentIndex = 0;
  private menuIndex = 0;
  private instrumentImage?: Phaser.GameObjects.Image;
  private instrumentName?: Phaser.GameObjects.Text;
  private instrumentDetail?: Phaser.GameObjects.Text;
  private resourceText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private menuTexts: Phaser.GameObjects.Text[] = [];
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super('SurvivalHubScene');
  }

  create() {
    this.progress = loadSurvivalProgress();
    this.instrumentIndex = Math.max(0, instrumentDefinitions.findIndex((item) => item.id === this.progress.selectedInstrument));
    this.menuIndex = 0;
    viewport(this, 0x08131f);
    const centerX = this.cameras.main.worldView.centerX;
    const centerY = this.cameras.main.worldView.centerY;

    this.add.rectangle(centerX, centerY, 760, 530, 0x102033, 0.98).setStrokeStyle(3, 0x31536f);
    addText(this, centerX, centerY - 238, '楽器無双', 43, '#ffffff', 'center').setOrigin(0.5);
    addText(this, centerX, centerY - 198, '永続強化アクション / 拠点', 18, '#7dd3fc', 'center').setOrigin(0.5);

    this.add.rectangle(centerX - 190, centerY - 34, 322, 278, 0x07111f, 0.78).setStrokeStyle(2, 0x31536f);
    this.instrumentImage = this.add.image(centerX - 190, centerY - 64, 'fighter-electric-guitar-base').setDisplaySize(150, 150);
    this.instrumentName = addText(this, centerX - 190, centerY + 42, '', 25, '#ffffff', 'center').setOrigin(0.5);
    this.instrumentDetail = addText(this, centerX - 190, centerY + 80, '', 15, '#cbd5e1', 'center')
      .setOrigin(0.5, 0)
      .setWordWrapWidth(280, true);
    addText(this, centerX - 190, centerY + 145, '← / →  楽器変更', 16, '#facc15', 'center').setOrigin(0.5);

    this.add.rectangle(centerX + 175, centerY - 34, 340, 278, 0x07111f, 0.78).setStrokeStyle(2, 0x31536f);
    const labels = ['通常戦へ出撃', '永続強化', '1対1 特別戦'];
    this.menuTexts = labels.map((label, index) =>
      addText(this, centerX + 175, centerY - 108 + index * 72, label, 25, '#e2e8f0', 'center').setOrigin(0.5),
    );
    this.statusText = addText(this, centerX + 175, centerY + 110, '', 15, '#94a3b8', 'center')
      .setOrigin(0.5)
      .setWordWrapWidth(300, true);

    this.resourceText = addText(this, centerX, centerY + 177, '', 19, '#e2e8f0', 'center').setOrigin(0.5);
    addText(this, centerX, centerY + 225, '↑/↓ 選択  Enter/Space 決定  Esc ホーム', 17, '#facc15', 'center').setOrigin(0.5);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
      this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    this.refresh();
  }

  update() {
    if (justDown(this.leftKey)) this.changeInstrument(-1);
    if (justDown(this.rightKey)) this.changeInstrument(1);
    if (justDown(this.upKey)) {
      this.menuIndex = (this.menuIndex + 2) % 3;
      this.refresh();
    }
    if (justDown(this.downKey)) {
      this.menuIndex = (this.menuIndex + 1) % 3;
      this.refresh();
    }
    if (justDown(this.enterKey) || justDown(this.spaceKey)) this.confirm();
    if (justDown(this.escapeKey)) this.scene.start('HomeScene');
  }

  private changeInstrument(direction: -1 | 1) {
    this.instrumentIndex = (this.instrumentIndex + direction + instrumentDefinitions.length) % instrumentDefinitions.length;
    this.progress = setSelectedInstrument(instrumentDefinitions[this.instrumentIndex].id);
    this.refresh();
  }

  private confirm() {
    const instrumentId = instrumentDefinitions[this.instrumentIndex].id;
    if (this.menuIndex === 0) this.scene.start('SurvivalBattleScene', { instrumentId });
    if (this.menuIndex === 1) this.scene.start('SurvivalUpgradeScene', { instrumentId });
    if (this.menuIndex === 2) {
      if (isSpecialBattleUnlocked(this.progress)) this.scene.start('ModeSelectScene');
      else this.statusText?.setText('特別戦は総レベル3で解放。まず通常戦でコインを持ち帰ろう。');
    }
  }

  private refresh() {
    const definition = instrumentDefinitions[this.instrumentIndex];
    const instrumentProgress = this.progress.instruments[definition.id];
    const totalLevel = getTotalLevel(this.progress);
    this.instrumentImage?.setTexture(definition.imageKey).setTint(definition.color);
    this.instrumentName?.setText(`${definition.name}  専用Lv.${instrumentProgress.specialtyLevel}`);
    this.instrumentDetail?.setText(`${definition.specialtyName}\n${definition.specialtyDescription}`);
    this.resourceText?.setText(
      `コイン ${this.progress.coins}　総レベル ${totalLevel}　最高敵水準 ${this.progress.bestThreat}\n${definition.materialName} ${instrumentProgress.material}`,
    );
    this.menuTexts.forEach((text, index) => {
      const selected = index === this.menuIndex;
      text.setColor(selected ? '#facc15' : '#e2e8f0').setText(`${selected ? '▶ ' : ''}${['通常戦へ出撃', '永続強化', `1対1 特別戦 ${isSpecialBattleUnlocked(this.progress) ? '' : '(総Lv.3)'}`][index]}`);
    });
    this.statusText?.setText(this.menuIndex === 0
      ? '敵は有限。全滅または時間経過で敵水準が上昇する。'
      : this.menuIndex === 1
        ? 'コインは共通強化、専用素材は楽器固有強化に使用。'
        : '既存の1対1戦闘を節目の特別戦として残している。');
  }
}

type UpgradeSceneData = { instrumentId?: InstrumentId };

export class SurvivalUpgradeScene extends Phaser.Scene {
  private progress = loadSurvivalProgress();
  private instrumentId: InstrumentId = 'electric-guitar';
  private selectedIndex = 0;
  private rowTexts: Phaser.GameObjects.Text[] = [];
  private headerText?: Phaser.GameObjects.Text;
  private descriptionText?: Phaser.GameObjects.Text;
  private upKey?: Phaser.Input.Keyboard.Key;
  private downKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super('SurvivalUpgradeScene');
  }

  init(data: UpgradeSceneData = {}) {
    if (data.instrumentId && instrumentById.has(data.instrumentId)) this.instrumentId = data.instrumentId;
  }

  create() {
    this.progress = loadSurvivalProgress();
    this.selectedIndex = 0;
    viewport(this);
    const centerX = this.cameras.main.worldView.centerX;
    const centerY = this.cameras.main.worldView.centerY;
    this.add.rectangle(centerX, centerY, 760, 550, 0x102033, 0.98).setStrokeStyle(3, 0x31536f);
    addText(this, centerX, centerY - 245, '永続強化', 38, '#ffffff', 'center').setOrigin(0.5);
    this.headerText = addText(this, centerX, centerY - 201, '', 18, '#7dd3fc', 'center').setOrigin(0.5);

    for (let index = 0; index < commonUpgradeDefinitions.length + 1; index += 1) {
      const column = index < 4 ? 0 : 1;
      const row = index < 4 ? index : index - 4;
      const x = centerX + (column === 0 ? -330 : 30);
      const y = centerY - 143 + row * 72;
      this.add.rectangle(x + 150, y + 23, 300, 58, 0x07111f, 0.8).setStrokeStyle(1, 0x31536f);
      this.rowTexts.push(addText(this, x + 16, y + 9, '', 19));
    }
    this.add.rectangle(centerX, centerY + 151, 690, 74, 0x07111f, 0.82).setStrokeStyle(2, 0x31536f);
    this.descriptionText = addText(this, centerX, centerY + 128, '', 17, '#cbd5e1', 'center')
      .setOrigin(0.5, 0)
      .setWordWrapWidth(650, true);
    addText(this, centerX, centerY + 243, '↑/↓ 選択  Enter/Space 購入  Esc 拠点へ', 17, '#facc15', 'center').setOrigin(0.5);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
      this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    this.refresh();
  }

  update() {
    if (justDown(this.upKey)) {
      this.selectedIndex = (this.selectedIndex + commonUpgradeDefinitions.length) % (commonUpgradeDefinitions.length + 1);
      this.refresh();
    }
    if (justDown(this.downKey)) {
      this.selectedIndex = (this.selectedIndex + 1) % (commonUpgradeDefinitions.length + 1);
      this.refresh();
    }
    if (justDown(this.enterKey) || justDown(this.spaceKey)) this.purchase();
    if (justDown(this.escapeKey)) this.scene.start('SurvivalHubScene');
  }

  private purchase() {
    const result = this.selectedIndex < commonUpgradeDefinitions.length
      ? buyCommonUpgrade(commonUpgradeDefinitions[this.selectedIndex].id)
      : buySpecialtyUpgrade(this.instrumentId);
    this.progress = result.progress;
    if (!result.purchased) {
      this.cameras.main.shake(90, 0.002);
      this.descriptionText?.setColor('#fca5a5');
    } else {
      this.descriptionText?.setColor('#86efac');
    }
    this.refresh();
  }

  private refresh() {
    const instrument = instrumentById.get(this.instrumentId)!;
    const specialty = this.progress.instruments[this.instrumentId];
    this.headerText?.setText(`コイン ${this.progress.coins}　総レベル ${getTotalLevel(this.progress)}　${instrument.materialName} ${specialty.material}`);
    commonUpgradeDefinitions.forEach((definition, index) => {
      const level = this.progress.commonLevels[definition.id];
      const cost = getCommonUpgradeCost(definition.id, level);
      this.rowTexts[index]?.setColor(index === this.selectedIndex ? '#facc15' : '#e2e8f0')
        .setText(`${index === this.selectedIndex ? '▶ ' : ''}${definition.name} Lv.${level}\n   ${cost} coin`);
    });
    const uniqueIndex = commonUpgradeDefinitions.length;
    const cost = getSpecialtyCost(specialty.specialtyLevel);
    this.rowTexts[uniqueIndex]?.setColor(uniqueIndex === this.selectedIndex ? '#facc15' : '#e2e8f0')
      .setText(`${uniqueIndex === this.selectedIndex ? '▶ ' : ''}${instrument.specialtyName} Lv.${specialty.specialtyLevel}\n   ${cost.coins} coin / 素材${cost.materials}`);
    const selected = this.selectedIndex < commonUpgradeDefinitions.length
      ? commonUpgradeDefinitions[this.selectedIndex].description
      : instrument.specialtyDescription;
    this.descriptionText?.setText(selected);
  }
}

type Enemy = {
  id: number;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  contactDamage: number;
  nextContactAt: number;
  coinValue: number;
  instrumentId: InstrumentId;
  boss: boolean;
  body: Phaser.GameObjects.Arc;
  glyph: Phaser.GameObjects.Text;
  hpBack?: Phaser.GameObjects.Rectangle;
  hpFill?: Phaser.GameObjects.Rectangle;
};

type Projectile = {
  body: Phaser.GameObjects.Arc;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  remainingPierce: number;
  distance: number;
  maxDistance: number;
  hitIds: Set<number>;
};

type DropKind = 'power' | 'tempo' | 'repair';
type FieldDrop = { kind: DropKind; x: number; y: number; body: Phaser.GameObjects.Arc; label: Phaser.GameObjects.Text };

type SurvivalBattleData = { instrumentId?: InstrumentId };
type TempBuff = { powerUntil: number; tempoUntil: number };

export class SurvivalBattleScene extends Phaser.Scene {
  private instrumentId: InstrumentId = 'electric-guitar';
  private progress = loadSurvivalProgress();
  private player?: Phaser.GameObjects.Image;
  private playerX = worldWidth / 2;
  private playerY = worldHeight / 2;
  private aimX = 1;
  private aimY = 0;
  private condition = 100;
  private maxCondition = 100;
  private attackDamage = 20;
  private attackRange = 90;
  private attackCooldown = 500;
  private moveSpeed = 240;
  private nextAttackAt = 0;
  private threat = 1;
  private highestThreat = 1;
  private nextThreatAt = 0;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private drops: FieldDrop[] = [];
  private enemyId = 0;
  private pendingAdvance = false;
  private runEnded = false;
  private runCoins = 0;
  private kills = 0;
  private runMaterials: Partial<Record<MaterialId, number>> = {};
  private startedAt = 0;
  private buffs: TempBuff = { powerUntil: 0, tempoUntil: 0 };
  private keys?: Record<
    'left' | 'right' | 'up' | 'down' | 'arrowLeft' | 'arrowRight' | 'arrowUp' | 'arrowDown' | 'attack' | 'attackAlt' | 'escape',
    Phaser.Input.Keyboard.Key
  >;
  private threatText?: Phaser.GameObjects.Text;
  private coinText?: Phaser.GameObjects.Text;
  private conditionText?: Phaser.GameObjects.Text;
  private conditionFill?: Phaser.GameObjects.Rectangle;
  private statusText?: Phaser.GameObjects.Text;
  private helpText?: Phaser.GameObjects.Text;

  constructor() {
    super('SurvivalBattleScene');
  }

  init(data: SurvivalBattleData = {}) {
    if (data.instrumentId && instrumentById.has(data.instrumentId)) this.instrumentId = data.instrumentId;
  }

  create() {
    this.resetRunState();
    this.progress = loadSurvivalProgress();
    const common = this.progress.commonLevels;
    this.maxCondition = 120 + common.condition * 18;
    this.condition = this.maxCondition;
    this.attackDamage = 24 * (1 + common.attack * 0.15);
    this.attackRange = 86 * (1 + common.range * 0.1);
    this.attackCooldown = 520 / (1 + common.attackSpeed * 0.1);
    this.moveSpeed = 235 * (1 + common.moveSpeed * 0.06);

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight).setBackgroundColor(0x07111f);
    const background = this.add.image(worldWidth / 2, worldHeight / 2, 'bg-live-house-pixel').setDisplaySize(worldWidth, worldHeight).setAlpha(0.42);
    background.setDepth(-3);
    this.add.rectangle(worldWidth / 2, worldHeight / 2, worldWidth, worldHeight, 0x07111f, 0.48).setDepth(-2);
    for (let x = 100; x < worldWidth; x += 200) this.add.line(0, 0, x, 0, x, worldHeight, 0x1e3a4d, 0.25).setOrigin(0).setDepth(-1);
    for (let y = 100; y < worldHeight; y += 200) this.add.line(0, 0, 0, y, worldWidth, y, 0x1e3a4d, 0.25).setOrigin(0).setDepth(-1);

    const definition = instrumentById.get(this.instrumentId)!;
    this.player = this.add.image(this.playerX, this.playerY, definition.imageKey).setDisplaySize(108, 108).setTint(definition.color).setDepth(5);
    this.add.circle(this.playerX, this.playerY + 34, 38, 0x020617, 0.48).setDepth(4).setName('player-shadow');
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

    this.createHud(definition.name);
    this.createInputs();
    this.input.on('pointerdown', this.handlePointerAttack, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.input.off('pointerdown', this.handlePointerAttack, this));

    this.startedAt = this.time.now;
    this.nextThreatAt = this.time.now + 26000;
    this.spawnThreat(1);
    this.flashStatus('敵水準 1 — 演奏開始！', '#facc15');
  }

  update(time: number, delta: number) {
    if (this.runEnded || !this.player || !this.keys) return;
    if (justDown(this.keys.escape)) {
      this.finishRun('撤退');
      return;
    }
    this.updatePlayer(delta);
    if ((this.keys.attack.isDown && time >= this.nextAttackAt) || justDown(this.keys.attackAlt)) this.performAttack(time);
    this.updateProjectiles(delta);
    this.updateEnemies(time, delta);
    this.updateDrops(time);

    if (!this.pendingAdvance && this.enemies.length === 0) {
      this.pendingAdvance = true;
      this.time.delayedCall(850, () => {
        if (!this.runEnded && this.enemies.length === 0) this.advanceThreat('全滅突破');
        else this.pendingAdvance = false;
      });
    }
    const bossAlive = this.enemies.some((enemy) => enemy.boss);
    if (!bossAlive && time >= this.nextThreatAt) this.advanceThreat('時間上昇');
    this.updateHud(time);
  }

  private resetRunState() {
    this.playerX = worldWidth / 2;
    this.playerY = worldHeight / 2;
    this.aimX = 1;
    this.aimY = 0;
    this.nextAttackAt = 0;
    this.threat = 1;
    this.highestThreat = 1;
    this.enemies = [];
    this.projectiles = [];
    this.drops = [];
    this.enemyId = 0;
    this.pendingAdvance = false;
    this.runEnded = false;
    this.runCoins = 0;
    this.kills = 0;
    this.runMaterials = {};
    this.buffs = { powerUntil: 0, tempoUntil: 0 };
  }

  private createInputs() {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    this.keys = {
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      arrowLeft: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      arrowRight: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      arrowUp: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      arrowDown: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      attack: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      attackAlt: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      escape: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
  }

  private createHud(instrumentName: string) {
    this.add.rectangle(18, 18, 320, 112, 0x020617, 0.82).setOrigin(0).setScrollFactor(0).setDepth(100).setStrokeStyle(2, 0x31536f);
    this.threatText = addText(this, 34, 29, '', 23, '#facc15').setScrollFactor(0).setDepth(101);
    this.coinText = addText(this, 34, 63, '', 17).setScrollFactor(0).setDepth(101);
    this.add.rectangle(34, 101, 274, 16, 0x450a0a).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
    this.conditionFill = this.add.rectangle(34, 101, 274, 12, 0x22c55e).setOrigin(0, 0.5).setScrollFactor(0).setDepth(102);
    this.conditionText = addText(this, 171, 101, '', 14, '#ffffff', 'center').setOrigin(0.5).setScrollFactor(0).setDepth(103);
    this.add.rectangle(0, 0, 270, 64, 0x020617, 0.76).setOrigin(1, 0).setPosition(Math.max(minWidth, this.scale.width) - 18, 18).setScrollFactor(0).setDepth(100);
    this.helpText = addText(this, Math.max(minWidth, this.scale.width) - 32, 30, [`${instrumentName}`, 'WASD/矢印 移動　Space/J/クリック 攻撃'], 14, '#cbd5e1', 'right')
      .setOrigin(1, 0).setScrollFactor(0).setDepth(101);
    this.statusText = addText(this, Math.max(minWidth, this.scale.width) / 2, 34, '', 22, '#facc15', 'center')
      .setOrigin(0.5).setScrollFactor(0).setDepth(110);
  }

  private updatePlayer(delta: number) {
    if (!this.player || !this.keys) return;
    const left = this.keys.left.isDown || this.keys.arrowLeft.isDown;
    const right = this.keys.right.isDown || this.keys.arrowRight.isDown;
    const up = this.keys.up.isDown || this.keys.arrowUp.isDown;
    const down = this.keys.down.isDown || this.keys.arrowDown.isDown;
    let dx = Number(right) - Number(left);
    let dy = Number(down) - Number(up);
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      dx /= length;
      dy /= length;
      this.aimX = dx;
      this.aimY = dy;
      this.playerX = Phaser.Math.Clamp(this.playerX + dx * this.moveSpeed * delta / 1000, 60, worldWidth - 60);
      this.playerY = Phaser.Math.Clamp(this.playerY + dy * this.moveSpeed * delta / 1000, 60, worldHeight - 60);
    }
    this.player.setPosition(this.playerX, this.playerY).setFlipX(this.aimX < 0);
    const shadow = this.children.getByName('player-shadow') as Phaser.GameObjects.Arc | null;
    shadow?.setPosition(this.playerX, this.playerY + 34);
  }

  private handlePointerAttack(pointer: Phaser.Input.Pointer) {
    if (!this.player || this.runEnded) return;
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const dx = worldPoint.x - this.playerX;
    const dy = worldPoint.y - this.playerY;
    const length = Math.hypot(dx, dy) || 1;
    this.aimX = dx / length;
    this.aimY = dy / length;
    if (this.time.now >= this.nextAttackAt) this.performAttack(this.time.now);
  }

  private aimAtNearestEnemy() {
    if (this.enemies.length === 0) return;
    let nearest = this.enemies[0];
    let distance = Number.POSITIVE_INFINITY;
    for (const enemy of this.enemies) {
      const candidate = Phaser.Math.Distance.Squared(this.playerX, this.playerY, enemy.x, enemy.y);
      if (candidate < distance) {
        nearest = enemy;
        distance = candidate;
      }
    }
    const dx = nearest.x - this.playerX;
    const dy = nearest.y - this.playerY;
    const length = Math.hypot(dx, dy) || 1;
    this.aimX = dx / length;
    this.aimY = dy / length;
  }

  private performAttack(time: number) {
    this.aimAtNearestEnemy();
    const specialty = this.progress.instruments[this.instrumentId].specialtyLevel;
    const power = time < this.buffs.powerUntil ? 1.35 : 1;
    const tempo = time < this.buffs.tempoUntil ? 1.35 : 1;
    this.nextAttackAt = time + this.attackCooldown / tempo;
    const damage = this.attackDamage * power;

    if (this.instrumentId === 'electric-guitar') {
      const hitX = this.playerX + this.aimX * this.attackRange * 0.72;
      const hitY = this.playerY + this.aimY * this.attackRange * 0.72;
      this.damageEnemiesInCircle(hitX, hitY, this.attackRange, damage);
      this.pulse(hitX, hitY, this.attackRange, 0xfacc15);
      if (specialty > 0) this.spawnProjectile(damage * Math.min(0.95, 0.52 + specialty * 0.1), specialty, 0xfacc15);
    } else if (this.instrumentId === 'drum-sticks') {
      const hits = 2 + Math.min(3, specialty);
      for (let hit = 0; hit < hits; hit += 1) {
        this.time.delayedCall(hit * 65, () => {
          if (this.runEnded) return;
          const radius = specialty >= 2 ? this.attackRange * 1.12 : this.attackRange * 0.72;
          const x = specialty >= 2 ? this.playerX : this.playerX + this.aimX * this.attackRange * 0.62;
          const y = specialty >= 2 ? this.playerY : this.playerY + this.aimY * this.attackRange * 0.62;
          this.damageEnemiesInCircle(x, y, radius, damage * 0.44);
          this.pulse(x, y, radius, 0xfb923c);
        });
      }
    } else if (this.instrumentId === 'bass') {
      const radius = this.attackRange * (1.12 + specialty * 0.1);
      const x = this.playerX + this.aimX * radius * 0.52;
      const y = this.playerY + this.aimY * radius * 0.52;
      this.damageEnemiesInCircle(x, y, radius, damage * (1.18 + specialty * 0.08), 32 + specialty * 10);
      this.pulse(x, y, radius, 0x38bdf8);
    } else {
      const notes = 2 + Math.min(5, specialty);
      for (let note = 0; note < notes; note += 1) {
        const spread = (note - (notes - 1) / 2) * 0.18;
        const angle = Math.atan2(this.aimY, this.aimX) + spread;
        this.spawnProjectile(damage * 0.68, specialty >= 3 ? 2 : 1, 0xc084fc, angle);
      }
    }
  }

  private spawnProjectile(damage: number, pierce: number, color: number, angle = Math.atan2(this.aimY, this.aimX)) {
    const speed = 620;
    const radius = 14 + this.progress.commonLevels.range * 1.2;
    const body = this.add.circle(this.playerX, this.playerY, radius, color, 0.78).setStrokeStyle(3, 0xffffff, 0.75).setDepth(6);
    this.projectiles.push({
      body,
      x: this.playerX,
      y: this.playerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage,
      radius,
      remainingPierce: Math.max(1, pierce),
      distance: 0,
      maxDistance: 430 + this.progress.commonLevels.range * 34,
      hitIds: new Set(),
    });
  }

  private updateProjectiles(delta: number) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      const step = delta / 1000;
      const dx = projectile.vx * step;
      const dy = projectile.vy * step;
      projectile.x += dx;
      projectile.y += dy;
      projectile.distance += Math.hypot(dx, dy);
      projectile.body.setPosition(projectile.x, projectile.y);
      for (const enemy of [...this.enemies]) {
        if (projectile.hitIds.has(enemy.id)) continue;
        if (Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) <= projectile.radius + enemy.radius) {
          projectile.hitIds.add(enemy.id);
          this.damageEnemy(enemy, projectile.damage);
          projectile.remainingPierce -= 1;
          if (projectile.remainingPierce <= 0) break;
        }
      }
      if (projectile.distance >= projectile.maxDistance || projectile.remainingPierce <= 0) {
        projectile.body.destroy();
        this.projectiles.splice(index, 1);
      }
    }
  }

  private damageEnemiesInCircle(x: number, y: number, radius: number, damage: number, knockback = 12) {
    for (const enemy of [...this.enemies]) {
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (distance <= radius + enemy.radius) {
        this.damageEnemy(enemy, damage);
        const dx = enemy.x - this.playerX;
        const dy = enemy.y - this.playerY;
        const length = Math.hypot(dx, dy) || 1;
        enemy.x += dx / length * knockback;
        enemy.y += dy / length * knockback;
      }
    }
  }

  private damageEnemy(enemy: Enemy, damage: number) {
    if (!this.enemies.includes(enemy)) return;
    enemy.hp -= damage;
    enemy.body.setFillStyle(0xffffff, 0.95);
    this.time.delayedCall(55, () => enemy.body.active && enemy.body.setFillStyle(instrumentById.get(enemy.instrumentId)!.color, enemy.boss ? 0.95 : 0.82));
    if (enemy.hp <= 0) this.defeatEnemy(enemy);
  }

  private defeatEnemy(enemy: Enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index < 0) return;
    this.enemies.splice(index, 1);
    this.runCoins += enemy.coinValue;
    this.kills += 1;
    const selectedMaterial = instrumentById.get(this.instrumentId)!.materialId;
    if (enemy.instrumentId === this.instrumentId && (enemy.boss || Math.random() < 0.22)) {
      const amount = enemy.boss ? (this.threat % 10 === 0 ? 4 : 2) : 1;
      this.runMaterials[selectedMaterial] = (this.runMaterials[selectedMaterial] ?? 0) + amount;
      this.floatText(enemy.x, enemy.y - 36, `+${amount} 素材`, '#facc15');
    }
    if (enemy.boss || Math.random() < 0.09) this.spawnDrop(enemy.x, enemy.y);
    this.pulse(enemy.x, enemy.y, enemy.radius * 1.5, instrumentById.get(enemy.instrumentId)!.color);
    enemy.body.destroy();
    enemy.glyph.destroy();
    enemy.hpBack?.destroy();
    enemy.hpFill?.destroy();
  }

  private updateEnemies(time: number, delta: number) {
    const step = delta / 1000;
    for (const enemy of this.enemies) {
      const dx = this.playerX - enemy.x;
      const dy = this.playerY - enemy.y;
      const distance = Math.hypot(dx, dy) || 1;
      enemy.x += dx / distance * enemy.speed * step;
      enemy.y += dy / distance * enemy.speed * step;
      enemy.body.setPosition(enemy.x, enemy.y);
      enemy.glyph.setPosition(enemy.x, enemy.y);
      enemy.hpBack?.setPosition(enemy.x - enemy.radius, enemy.y - enemy.radius - 14);
      enemy.hpFill?.setPosition(enemy.x - enemy.radius, enemy.y - enemy.radius - 14).setSize(enemy.radius * 2 * Math.max(0, enemy.hp / enemy.maxHp), 5);
      if (distance <= enemy.radius + 36 && time >= enemy.nextContactAt) {
        enemy.nextContactAt = time + (enemy.boss ? 650 : 920);
        this.condition -= enemy.contactDamage;
        this.cameras.main.shake(80, 0.003);
        this.player?.setTint(0xffffff);
        this.time.delayedCall(80, () => this.player?.active && this.player.setTint(instrumentById.get(this.instrumentId)!.color));
        if (this.condition <= 0) {
          this.condition = 0;
          this.finishRun('コンディション切れ');
          return;
        }
      }
    }
  }

  private spawnThreat(level: number) {
    const isMidBoss = level % 5 === 0;
    const isBigBoss = level % 10 === 0;
    const count = isMidBoss ? Math.min(12, 4 + Math.floor(level / 2)) : Math.min(22, 5 + Math.floor(level * 1.35));
    for (let index = 0; index < count; index += 1) this.spawnEnemy(level, false);
    if (isMidBoss) this.spawnEnemy(level, true, isBigBoss);
    this.pendingAdvance = false;
    this.nextThreatAt = this.time.now + Math.max(17000, 27000 - level * 220);
  }

  private spawnEnemy(level: number, boss: boolean, bigBoss = false) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Phaser.Math.Between(420, 690);
    const x = Phaser.Math.Clamp(this.playerX + Math.cos(angle) * distance, 70, worldWidth - 70);
    const y = Phaser.Math.Clamp(this.playerY + Math.sin(angle) * distance, 70, worldHeight - 70);
    const instrumentId = boss ? this.instrumentId : instrumentDefinitions[Phaser.Math.Between(0, instrumentDefinitions.length - 1)].id;
    const definition = instrumentById.get(instrumentId)!;
    const radius = boss ? (bigBoss ? 62 : 50) : 24 + Math.min(10, level * 0.45);
    const hp = boss ? (bigBoss ? 560 : 300) * (1 + level * 0.16) : 34 * (1 + level * 0.14);
    const body = this.add.circle(x, y, radius, definition.color, boss ? 0.95 : 0.82).setStrokeStyle(boss ? 5 : 2, 0xffffff, boss ? 0.85 : 0.42).setDepth(3);
    const glyph = addText(this, x, y, boss ? (bigBoss ? 'BOSS' : 'SOLO') : definition.shortName.slice(0, 1), boss ? 14 : 12, '#07111f', 'center').setOrigin(0.5).setDepth(4);
    const hpBack = boss ? this.add.rectangle(x - radius, y - radius - 14, radius * 2, 5, 0x450a0a).setOrigin(0, 0.5).setDepth(4) : undefined;
    const hpFill = boss ? this.add.rectangle(x - radius, y - radius - 14, radius * 2, 5, 0x22c55e).setOrigin(0, 0.5).setDepth(5) : undefined;
    this.enemies.push({
      id: ++this.enemyId,
      x,
      y,
      radius,
      hp,
      maxHp: hp,
      speed: boss ? (bigBoss ? 70 : 82) : 74 + Math.min(70, level * 3.4) + Math.random() * 24,
      contactDamage: boss ? (bigBoss ? 24 : 17) + level * 0.65 : 7 + level * 0.55,
      nextContactAt: 0,
      coinValue: boss ? (bigBoss ? 150 : 70) + level * 7 : 4 + Math.floor(level * 0.9),
      instrumentId,
      boss,
      body,
      glyph,
      hpBack,
      hpFill,
    });
  }

  private advanceThreat(reason: string) {
    if (this.runEnded || this.enemies.some((enemy) => enemy.boss)) return;
    this.threat += 1;
    this.highestThreat = Math.max(this.highestThreat, this.threat);
    const recoveryLevel = this.progress.commonLevels.recovery;
    const heal = this.maxCondition * 0.035 * (1 + recoveryLevel * 0.12);
    this.condition = Math.min(this.maxCondition, this.condition + heal);
    this.spawnThreat(this.threat);
    this.flashStatus(`${reason} → 敵水準 ${this.threat}${this.threat % 5 === 0 ? '  中ボス出現！' : ''}`, this.threat % 5 === 0 ? '#fb7185' : '#facc15');
  }

  private spawnDrop(x: number, y: number) {
    const kinds: DropKind[] = ['power', 'tempo', 'repair'];
    const kind = kinds[Phaser.Math.Between(0, kinds.length - 1)];
    const color = kind === 'power' ? 0xef4444 : kind === 'tempo' ? 0x38bdf8 : 0x22c55e;
    const body = this.add.circle(x, y, 18, color, 0.92).setStrokeStyle(3, 0xffffff, 0.8).setDepth(6);
    const label = addText(this, x, y, kind === 'power' ? 'P' : kind === 'tempo' ? 'T' : '+', 18, '#ffffff', 'center').setOrigin(0.5).setDepth(7);
    this.drops.push({ kind, x, y, body, label });
  }

  private updateDrops(time: number) {
    for (let index = this.drops.length - 1; index >= 0; index -= 1) {
      const drop = this.drops[index];
      if (Phaser.Math.Distance.Between(this.playerX, this.playerY, drop.x, drop.y) > 56) continue;
      if (drop.kind === 'power') {
        this.buffs.powerUntil = time + 15000;
        this.flashStatus('POWER UP：音圧 +35%（15秒）', '#fca5a5');
      } else if (drop.kind === 'tempo') {
        this.buffs.tempoUntil = time + 15000;
        this.flashStatus('TEMPO UP：攻撃速度 +35%（15秒）', '#7dd3fc');
      } else {
        const recovery = 0.26 * (1 + this.progress.commonLevels.recovery * 0.12);
        this.condition = Math.min(this.maxCondition, this.condition + this.maxCondition * recovery);
        this.flashStatus('リペア：コンディション回復', '#86efac');
      }
      drop.body.destroy();
      drop.label.destroy();
      this.drops.splice(index, 1);
    }
  }

  private updateHud(time: number) {
    this.threatText?.setText(`敵水準 ${this.threat}${this.enemies.some((enemy) => enemy.boss) ? '  ⚠ LOCK' : ''}`);
    const material = instrumentById.get(this.instrumentId)!.materialId;
    this.coinText?.setText(`持帰りコイン ${this.runCoins}　撃破 ${this.kills}　素材 ${this.runMaterials[material] ?? 0}`);
    const ratio = Math.max(0, this.condition / this.maxCondition);
    this.conditionFill?.setSize(274 * ratio, 12).setFillStyle(ratio > 0.5 ? 0x22c55e : ratio > 0.25 ? 0xf59e0b : 0xef4444);
    this.conditionText?.setText(`CONDITION ${Math.ceil(this.condition)} / ${this.maxCondition}`);
    const buffs = [time < this.buffs.powerUntil ? `POWER ${Math.ceil((this.buffs.powerUntil - time) / 1000)}s` : '', time < this.buffs.tempoUntil ? `TEMPO ${Math.ceil((this.buffs.tempoUntil - time) / 1000)}s` : ''].filter(Boolean);
    if (buffs.length > 0) this.helpText?.setText(`${buffs.join(' / ')}\nWASD/矢印 移動　Space/J/クリック 攻撃`);
  }

  private pulse(x: number, y: number, radius: number, color: number) {
    const ring = this.add.circle(x, y, Math.max(8, radius * 0.3), color, 0.18).setStrokeStyle(4, color, 0.9).setDepth(8);
    this.tweens.add({ targets: ring, scale: 2.2, alpha: 0, duration: 180, onComplete: () => ring.destroy() });
  }

  private floatText(x: number, y: number, text: string, color: string) {
    const label = addText(this, x, y, text, 16, color, 'center').setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: label, y: y - 35, alpha: 0, duration: 700, onComplete: () => label.destroy() });
  }

  private flashStatus(text: string, color: string) {
    this.statusText?.setText(text).setColor(color).setAlpha(1);
    if (this.statusText) this.tweens.add({ targets: this.statusText, alpha: 0, delay: 1400, duration: 500 });
  }

  private finishRun(reason: string) {
    if (this.runEnded) return;
    this.runEnded = true;
    const rewards: SurvivalRunRewards = {
      coins: this.runCoins,
      bestThreat: this.highestThreat,
      instrumentId: this.instrumentId,
      materials: this.runMaterials,
    };
    this.scene.start('SurvivalResultScene', {
      instrumentId: this.instrumentId,
      rewards,
      reason,
      kills: this.kills,
      durationMs: this.time.now - this.startedAt,
    });
  }
}

type SurvivalResultData = {
  instrumentId?: InstrumentId;
  rewards?: SurvivalRunRewards;
  reason?: string;
  kills?: number;
  durationMs?: number;
};

export class SurvivalResultScene extends Phaser.Scene {
  private instrumentId: InstrumentId = 'electric-guitar';
  private rewards: SurvivalRunRewards = { coins: 0, bestThreat: 1, instrumentId: 'electric-guitar', materials: {} };
  private reason = '戦闘終了';
  private kills = 0;
  private durationMs = 0;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private rKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super('SurvivalResultScene');
  }

  init(data: SurvivalResultData = {}) {
    if (data.instrumentId && instrumentById.has(data.instrumentId)) this.instrumentId = data.instrumentId;
    if (data.rewards) this.rewards = data.rewards;
    this.reason = data.reason ?? '戦闘終了';
    this.kills = data.kills ?? 0;
    this.durationMs = data.durationMs ?? 0;
  }

  create() {
    const progress = bankRunRewards(this.rewards);
    const definition = instrumentById.get(this.instrumentId)!;
    const material = this.rewards.materials[definition.materialId] ?? 0;
    viewport(this, 0x08131f);
    const centerX = this.cameras.main.worldView.centerX;
    const centerY = this.cameras.main.worldView.centerY;
    this.add.rectangle(centerX, centerY, 700, 500, 0x102033, 0.98).setStrokeStyle(4, definition.color);
    addText(this, centerX, centerY - 205, this.reason, 38, '#ffffff', 'center').setOrigin(0.5);
    addText(this, centerX, centerY - 156, `${definition.name} RUN RESULT`, 18, '#7dd3fc', 'center').setOrigin(0.5);
    this.add.image(centerX - 205, centerY - 22, definition.imageKey).setDisplaySize(185, 185).setTint(definition.color);
    addText(this, centerX + 20, centerY - 112, [
      `到達敵水準　${this.rewards.bestThreat}`,
      `撃破数　　　${this.kills}`,
      `生存時間　　${Math.floor(this.durationMs / 60000)}:${String(Math.floor(this.durationMs / 1000) % 60).padStart(2, '0')}`,
      `獲得コイン　+${this.rewards.coins}`,
      `${definition.materialName}　+${material}`,
    ], 23, '#e2e8f0').setOrigin(0, 0.5);
    this.add.rectangle(centerX, centerY + 132, 610, 58, 0x07111f, 0.82).setStrokeStyle(2, 0x31536f);
    addText(this, centerX, centerY + 132, `所持コイン ${progress.coins}　総レベル ${getTotalLevel(progress)}　最高敵水準 ${progress.bestThreat}`, 18, '#facc15', 'center').setOrigin(0.5);
    addText(this, centerX, centerY + 210, 'Enter/Space 拠点へ　R もう一度', 19, '#facc15', 'center').setOrigin(0.5);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.rKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
  }

  update() {
    if (justDown(this.enterKey) || justDown(this.spaceKey)) this.scene.start('SurvivalHubScene');
    if (justDown(this.rKey)) this.scene.start('SurvivalBattleScene', { instrumentId: this.instrumentId });
  }
}
