import Phaser from 'phaser';

const gameWidth = 800;
const gameHeight = 600;
const fighterWidth = 72;
const guitarStats = {
  maxHp: 100,
  moveSpeed: 260,
  attackDamage: 10,
  knockbackSpeed: 520,
  attackWidth: 104,
  attackHeight: 52,
  attackYOffset: -8,
  attackColor: 0xfacc15,
  attackStrokeColor: 0xfef08a,
};
const bassStats = {
  maxHp: 110,
  moveSpeed: 230,
  attackDamage: 10,
  knockbackSpeed: 600,
  attackWidth: 88,
  attackHeight: 86,
  attackYOffset: 4,
  attackColor: 0xf59e0b,
  attackStrokeColor: 0xfef3c7,
};
const player1StartX = 240;
const player2StartX = 560;
const attackDurationMs = 180;
const attackCooldownMs = 240;
const knockbackDecay = 2800;
const knockbackStopSpeed = 8;
const hitFlashColor = 0xffffff;
const hitFlashDurationMs = 120;
const hpBarWidth = 220;
const hpBarHeight = 18;
const hpBarInset = 3;

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

type Fighter = {
  body: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  facing: -1 | 1;
  nextAttackAt: number;
  knockbackVelocity: number;
  normalColor: number;
  stats: FighterStats;
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

class BattleScene extends Phaser.Scene {
  private player1!: Fighter;
  private player2!: Fighter;
  private player1Hp!: PlayerHp;
  private player2Hp!: PlayerHp;
  private resultText!: Phaser.GameObjects.Text;
  private restartHintText!: Phaser.GameObjects.Text;
  private activeAttacks: ActiveAttack[] = [];
  private matchOver = false;
  private controls?: {
    player1: PlayerControls;
    player2: PlayerControls;
    restart: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.rectangle(400, 300, gameWidth, gameHeight, 0x111827);
    this.add.rectangle(400, 360, 720, 260, 0x1e293b).setStrokeStyle(4, 0x475569);
    this.add.rectangle(400, 500, 680, 40, 0x334155);

    this.player1Hp = this.createHpUi(32, 24, 'P1', guitarStats.maxHp, '#fed7aa', 0x22c55e, 0);
    this.player2Hp = this.createHpUi(768, 24, 'P2', bassStats.maxHp, '#bae6fd', 0x38bdf8, 1);

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
      .text(400, 150, 'P1: A / D move, W / Space attack    P2: ← / → move, ↑ / Enter attack    R restart', {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5);

    this.resultText = this.add
      .text(400, 250, '', {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '48px',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.restartHintText = this.add
      .text(400, 306, 'Press R to restart', {
        color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.player1 = this.createFighter(player1StartX, 0xf97316, 0xffedd5, 'P1\nElectric Guitar', '#fed7aa', guitarStats);
    this.player2 = this.createFighter(player2StartX, 0x38bdf8, 0xe0f2fe, 'P2\nBass', '#bae6fd', bassStats);
    this.player2.facing = -1;
    this.controls = this.createControls();
  }

  update(time: number, delta: number) {
    if (!this.controls) {
      return;
    }

    if (this.matchOver) {
      this.tryRestart();
      return;
    }

    this.moveFighter(this.player1, this.controls.player1, delta);
    this.moveFighter(this.player2, this.controls.player2, delta);
    this.tryAttack(this.player1, this.controls.player1, time);
    this.tryAttack(this.player2, this.controls.player2, time);
    this.updateActiveAttacks(time);
    this.updateKnockback(this.player1, delta);
    this.updateKnockback(this.player2, delta);
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

  private createFighter(
    x: number,
    fillColor: number,
    strokeColor: number,
    label: string,
    labelColor: string,
    stats: FighterStats,
  ): Fighter {
    const body = this.add.rectangle(x, 440, fighterWidth, 120, fillColor).setStrokeStyle(3, strokeColor);
    const labelText = this.add
      .text(x, 520, label, {
        align: 'center',
        color: labelColor,
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5, 0);

    return { body, label: labelText, facing: 1, nextAttackAt: 0, knockbackVelocity: 0, normalColor: fillColor, stats };
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
      restart: Phaser.Input.Keyboard.KeyCodes.R,
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
      restart: keys.restart,
    };
  }

  private moveFighter(fighter: Fighter, keys: PlayerControls, delta: number) {
    const distance = fighter.stats.moveSpeed * (delta / 1000);
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

    const nextX = Phaser.Math.Clamp(
      fighter.body.x + horizontalInput * distance,
      fighterWidth / 2,
      gameWidth - fighterWidth / 2,
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

    fighter.nextAttackAt = time + attackCooldownMs;
    const opponent = fighter === this.player1 ? this.player2 : this.player1;
    const opponentHp = fighter === this.player1 ? this.player2Hp : this.player1Hp;

    this.createAttackHitbox(fighter, opponent, opponentHp, time);
  }

  private createAttackHitbox(fighter: Fighter, opponent: Fighter, opponentHp: PlayerHp, time: number) {
    const hitboxX = fighter.body.x + fighter.facing * (fighterWidth / 2 + fighter.stats.attackWidth / 2);
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
    const nextX = Phaser.Math.Clamp(
      fighter.body.x + fighter.knockbackVelocity * deltaSeconds,
      fighterWidth / 2,
      gameWidth - fighterWidth / 2,
    );

    fighter.body.setX(nextX);
    fighter.label.setX(nextX);

    if (nextX === fighterWidth / 2 || nextX === gameWidth - fighterWidth / 2) {
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

    const result = player1Defeated && player2Defeated ? 'Draw' : player1Defeated ? 'P2 Wins' : 'P1 Wins';
    this.endMatch(result);
  }

  private endMatch(result: string) {
    this.matchOver = true;
    this.clearActiveAttacks();
    this.resetFighterColor(this.player1);
    this.resetFighterColor(this.player2);
    this.resultText.setText(result).setVisible(true);
    this.restartHintText.setVisible(true);
  }

  private tryRestart() {
    if (this.controls && Phaser.Input.Keyboard.JustDown(this.controls.restart)) {
      this.restartMatch();
    }
  }

  private restartMatch() {
    this.matchOver = false;
    this.resultText.setVisible(false);
    this.restartHintText.setVisible(false);

    this.player1Hp.current = this.player1Hp.max;
    this.player2Hp.current = this.player2Hp.max;
    this.updateHpUi(this.player1Hp);
    this.updateHpUi(this.player2Hp);

    this.clearActiveAttacks();
    this.resetFighterColor(this.player1);
    this.resetFighterColor(this.player2);
    this.resetFighter(this.player1, player1StartX, 1);
    this.resetFighter(this.player2, player2StartX, -1);
  }

  private clearActiveAttacks() {
    for (const attack of this.activeAttacks) {
      attack.hitbox.destroy();
    }

    this.activeAttacks = [];
  }

  private resetFighter(fighter: Fighter, x: number, facing: -1 | 1) {
    fighter.body.setX(x);
    fighter.label.setX(x);
    fighter.facing = facing;
    fighter.nextAttackAt = 0;
    fighter.knockbackVelocity = 0;
    this.resetFighterColor(fighter);
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
