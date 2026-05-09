import Phaser from 'phaser';

const gameWidth = 800;
const gameHeight = 600;

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 360, 720, 260, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 500, 680, 40, 0x334155);

    this.add
      .text(400, 64, 'Instrument Brawl', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '40px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 112, 'Electric Guitar vs Bass', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);

    this.add.rectangle(240, 440, 72, 120, 0xf97316).setStrokeStyle(3, 0xffedd5);
    this.add
      .text(240, 520, 'P1\nElectric Guitar', {
        align: 'center',
        color: '#fed7aa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5, 0);

    this.add.rectangle(560, 440, 72, 120, 0x38bdf8).setStrokeStyle(3, 0xe0f2fe);
    this.add
      .text(560, 520, 'P2\nBass', {
        align: 'center',
        color: '#bae6fd',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5, 0);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: gameWidth,
  height: gameHeight,
  backgroundColor: '#111827',
  scene: BattleScene,
});
