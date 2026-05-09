import Phaser from 'phaser';

const gameWidth = 800;
const gameHeight = 600;
const fighterWidth = 72;
const fighterSpeed = 260;
const startingHp = 100;

type Fighter = {
  body: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
};

type MovementKeys = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

type PlayerHp = {
  current: number;
  text: Phaser.GameObjects.Text;
};

class BattleScene extends Phaser.Scene {
  private player1!: Fighter;
  private player2!: Fighter;
  private player1Hp!: PlayerHp;
  private player2Hp!: PlayerHp;
  private controls?: {
    player1: MovementKeys;
    player2: MovementKeys;
  };

  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 360, 720, 260, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 500, 680, 40, 0x334155);

    this.player1Hp = this.createHpText(32, 24, 'P1', '#fed7aa');
    this.player2Hp = this.createHpText(768, 24, 'P2', '#bae6fd');
    this.player1Hp.text.setOrigin(0, 0);
    this.player2Hp.text.setOrigin(1, 0);

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

    this.add
      .text(400, 150, 'P1: A / D    P2: ← / →', {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.player1 = this.createFighter(240, 0xf97316, 0xffedd5, 'P1\nElectric Guitar', '#fed7aa');
    this.player2 = this.createFighter(560, 0x38bdf8, 0xe0f2fe, 'P2\nBass', '#bae6fd');
    this.controls = this.createControls();
  }

  update(_time: number, delta: number) {
    if (!this.controls) {
      return;
    }

    const distance = fighterSpeed * (delta / 1000);

    this.moveFighter(this.player1, this.controls.player1, distance);
    this.moveFighter(this.player2, this.controls.player2, distance);
  }

  private createHpText(x: number, y: number, playerName: string, color: string): PlayerHp {
    const hp = {
      current: startingHp,
      text: this.add.text(x, y, '', {
        color,
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      }),
    };

    hp.text.setText(`${playerName} HP: ${hp.current}`);

    return hp;
  }

  private createFighter(x: number, fillColor: number, strokeColor: number, label: string, labelColor: string): Fighter {
    const body = this.add.rectangle(x, 440, fighterWidth, 120, fillColor).setStrokeStyle(3, strokeColor);
    const labelText = this.add
      .text(x, 520, label, {
        align: 'center',
        color: labelColor,
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5, 0);

    return { body, label: labelText };
  }

  private createControls() {
    const keyboard = this.input.keyboard;

    if (!keyboard) {
      return undefined;
    }

    const keys = keyboard.addKeys({
      player1Left: Phaser.Input.Keyboard.KeyCodes.A,
      player1Right: Phaser.Input.Keyboard.KeyCodes.D,
      player2Left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      player2Right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    return {
      player1: {
        left: keys.player1Left,
        right: keys.player1Right,
      },
      player2: {
        left: keys.player2Left,
        right: keys.player2Right,
      },
    };
  }

  private moveFighter(fighter: Fighter, keys: MovementKeys, distance: number) {
    let nextX = fighter.body.x;

    if (keys.left.isDown) {
      nextX -= distance;
    }

    if (keys.right.isDown) {
      nextX += distance;
    }

    nextX = Phaser.Math.Clamp(nextX, fighterWidth / 2, gameWidth - fighterWidth / 2);

    fighter.body.setX(nextX);
    fighter.label.setX(nextX);
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
