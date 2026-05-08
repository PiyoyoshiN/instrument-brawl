class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.add
      .text(400, 260, 'Instrument Brawl', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '40px',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 320, '起動確認用の最小構成', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#111827',
  scene: BootScene,
});
