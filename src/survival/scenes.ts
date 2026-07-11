import Phaser from 'phaser';
import {
  bankRunRewards,
  autoSkillDefinitions,
  buyAutoSkillUpgrade,
  buyCommonUpgrade,
  buySpecialtyUpgrade,
  commonUpgradeDefinitions,
  getCommonUpgradeCost,
  getAutoSkillCost,
  getSpecialtyCost,
  getTotalLevel,
  getInstrumentPowerLevel,
  getInstrumentStartingThreat,
  getInstrumentThreatCap,
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
  const scrollX = (minWidth - width) / 2;
  const scrollY = (minHeight - height) / 2;
  const centerX = scrollX + width / 2;
  const centerY = scrollY + height / 2;
  scene.cameras.main.setScroll(scrollX, scrollY);
  scene.cameras.main.setBackgroundColor(color);
  const background = scene.add.rectangle(centerX, centerY, width, height, color);

  const resizeHandler = () => {
    const nextWidth = Math.max(minWidth, scene.scale.width);
    const nextHeight = Math.max(minHeight, scene.scale.height);
    const nextScrollX = (minWidth - nextWidth) / 2;
    const nextScrollY = (minHeight - nextHeight) / 2;
    scene.cameras.main.setScroll(nextScrollX, nextScrollY);
    background.setPosition(nextScrollX + nextWidth / 2, nextScrollY + nextHeight / 2);
    background.setSize(nextWidth, nextHeight);
  };

  scene.scale.on('resize', resizeHandler);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.scale.off('resize', resizeHandler));
  return { centerX, centerY };
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
    const { centerX, centerY } = viewport(this, 0x08131f);

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
    const instrumentLevel = getInstrumentPowerLevel(this.progress, definition.id);
    const unlockedThreat = getInstrumentThreatCap(this.progress, definition.id);
    const startingThreat = getInstrumentStartingThreat(this.progress, definition.id);
    this.instrumentImage?.setTexture(definition.imageKey).setTint(definition.color);
    this.instrumentName?.setText(`${definition.name}  専用Lv.${instrumentProgress.specialtyLevel}`);
    const specialtyNumbers = definition.id === 'electric-guitar' && instrumentProgress.specialtyLevel > 0
      ? `\n距離残存率 ${Math.round(Math.min(0.97, 0.64 + instrumentProgress.specialtyLevel * 0.055) * 100)}% / 貫通残存率 ${Math.round(Math.min(0.96, 0.7 + instrumentProgress.specialtyLevel * 0.045) * 100)}%`
      : '';
    this.instrumentDetail?.setText(`${definition.specialtyName}\n${definition.specialtyDescription}${specialtyNumbers}`);
    this.resourceText?.setText(
      `コイン ${this.progress.coins}　総Lv.${totalLevel} / ${definition.shortName}Lv.${instrumentLevel}\n${definition.shortName}：水準${instrumentProgress.highestClearedThreat}までクリア・${startingThreat}開始・${unlockedThreat}まで解放　${definition.materialName} ${instrumentProgress.material}`,
    );
    this.menuTexts.forEach((text, index) => {
      const selected = index === this.menuIndex;
      text.setColor(selected ? '#facc15' : '#e2e8f0').setText(`${selected ? '▶ ' : ''}${['通常戦へ出撃', '永続強化', `1対1 特別戦 ${isSpecialBattleUnlocked(this.progress) ? '' : '(総Lv.3)'}`][index]}`);
    });
    this.statusText?.setText(this.menuIndex === 0
      ? '強化するほど開始水準と敵解放上限が上昇。ボス水準から直接開始することはない。'
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
    // Phaser reuses Scene instances. Clear references to display objects that
    // were destroyed during the previous visit before rebuilding this screen.
    this.rowTexts = [];
    const { centerX, centerY } = viewport(this);
    this.add.rectangle(centerX, centerY, 760, 550, 0x102033, 0.98).setStrokeStyle(3, 0x31536f);
    addText(this, centerX, centerY - 245, '永続強化', 38, '#ffffff', 'center').setOrigin(0.5);
    this.headerText = addText(this, centerX, centerY - 201, '', 18, '#7dd3fc', 'center').setOrigin(0.5);

    for (let index = 0; index < commonUpgradeDefinitions.length; index += 1) {
      const column = index < 3 ? 0 : 1;
      const row = index % 3;
      const x = centerX + (column === 0 ? -330 : 30);
      const y = centerY - 150 + row * 68;
      this.add.rectangle(x + 150, y + 23, 300, 58, 0x07111f, 0.8).setStrokeStyle(1, 0x31536f);
      this.rowTexts.push(addText(this, x + 16, y + 9, '', 19));
    }
    const specialtyY = centerY + 62;
    this.add.rectangle(centerX - 168, specialtyY + 23, 322, 58, 0x07111f, 0.82).setStrokeStyle(2, 0x8b5cf6);
    this.add.rectangle(centerX + 168, specialtyY + 23, 322, 58, 0x07111f, 0.82).setStrokeStyle(2, 0x22d3ee);
    this.rowTexts.push(addText(this, centerX - 314, specialtyY + 9, '', 18));
    this.rowTexts.push(addText(this, centerX + 22, specialtyY + 9, '', 18));

    this.add.rectangle(centerX, centerY + 161, 690, 70, 0x07111f, 0.82).setStrokeStyle(2, 0x31536f);
    this.descriptionText = addText(this, centerX, centerY + 138, '', 17, '#cbd5e1', 'center')
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
    const selectableCount = commonUpgradeDefinitions.length + 2;
    if (justDown(this.upKey)) {
      this.selectedIndex = (this.selectedIndex + selectableCount - 1) % selectableCount;
      this.refresh();
    }
    if (justDown(this.downKey)) {
      this.selectedIndex = (this.selectedIndex + 1) % selectableCount;
      this.refresh();
    }
    if (justDown(this.enterKey) || justDown(this.spaceKey)) this.purchase();
    if (justDown(this.escapeKey)) this.scene.start('SurvivalHubScene');
  }

  private purchase() {
    const specialtyIndex = commonUpgradeDefinitions.length;
    const result = this.selectedIndex < specialtyIndex
      ? buyCommonUpgrade(commonUpgradeDefinitions[this.selectedIndex].id)
      : this.selectedIndex === specialtyIndex
        ? buySpecialtyUpgrade(this.instrumentId)
        : buyAutoSkillUpgrade(this.instrumentId);
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
    this.headerText?.setText(
      `コイン ${this.progress.coins}　総Lv.${getTotalLevel(this.progress)} / ${instrument.shortName}Lv.${getInstrumentPowerLevel(this.progress, this.instrumentId)}　${instrument.materialName} ${specialty.material}`,
    );
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
    const autoIndex = uniqueIndex + 1;
    const autoDefinition = autoSkillDefinitions[this.instrumentId];
    const autoCost = getAutoSkillCost(specialty.autoSkillLevel);
    this.rowTexts[autoIndex]?.setColor(autoIndex === this.selectedIndex ? '#facc15' : '#e2e8f0')
      .setText(`${autoIndex === this.selectedIndex ? '▶ ' : ''}${autoDefinition.name} Lv.${specialty.autoSkillLevel}\n   ${autoCost.coins} coin / 素材${autoCost.materials}`);
    const selected = this.selectedIndex < uniqueIndex
      ? commonUpgradeDefinitions[this.selectedIndex].description
      : this.selectedIndex === uniqueIndex
        ? instrument.specialtyDescription
        : `${autoDefinition.description} Lv.1で解放し、強化すると威力と発動間隔が向上する。`;
    this.descriptionText?.setText(selected);
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
  private rewards: SurvivalRunRewards = {
    coins: 0,
    bestThreat: 1,
    highestClearedThreat: 0,
    instrumentId: 'electric-guitar',
    materials: {},
  };
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
    const { centerX, centerY } = viewport(this, 0x08131f);
    this.add.rectangle(centerX, centerY, 700, 500, 0x102033, 0.98).setStrokeStyle(4, definition.color);
    addText(this, centerX, centerY - 205, this.reason, 38, '#ffffff', 'center').setOrigin(0.5);
    addText(this, centerX, centerY - 156, `${definition.name} RUN RESULT`, 18, '#7dd3fc', 'center').setOrigin(0.5);
    this.add.image(centerX - 205, centerY - 22, definition.imageKey).setDisplaySize(185, 185).setTint(definition.color);
    addText(this, centerX + 20, centerY - 112, [
      `到達敵水準　${this.rewards.bestThreat}`,
      `連続クリア　水準${this.rewards.highestClearedThreat}`,
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
