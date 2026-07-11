import Phaser from 'phaser';
import * as THREE from 'three';
import {
  getTotalLevel,
  getRecommendedStartingThreat,
  getThreatUnlockForTotalLevel,
  instrumentById,
  loadSurvivalProgress,
  type InstrumentId,
  type MaterialId,
  type SurvivalProgress,
  type SurvivalRunRewards,
} from './progression';

type EnemyKind = 'walker' | 'charger' | 'ranged' | 'brute' | 'support';
type BossKind = 'amp-shroom' | 'clockwork-maestro' | 'neon-conductor';

type Enemy3D = {
  id: number;
  kind: EnemyKind;
  instrumentId: InstrumentId;
  group: THREE.Group;
  hp: number;
  maxHp: number;
  speed: number;
  radius: number;
  damage: number;
  coinValue: number;
  nextActionAt: number;
  nextContactAt: number;
  state: 'seek' | 'telegraph' | 'dash';
  stateUntil: number;
  dashDirection: THREE.Vector3;
  knockback: THREE.Vector3;
  boss: boolean;
  bossKind?: BossKind;
  healthBar?: THREE.Mesh;
};

type PlayerProjectile = {
  mesh: THREE.Mesh;
  direction: THREE.Vector3;
  speed: number;
  damage: number;
  radius: number;
  traveled: number;
  maxDistance: number;
  distanceRetention: number;
  penetrationRetention: number;
  remainingPierce: number;
  hitIds: Set<number>;
  color: number;
};

type EnemyProjectile = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  radius: number;
  damage: number;
  life: number;
};

type Impact = { mesh: THREE.Mesh; life: number; maxLife: number; maxScale: number };
type Particle = { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number };
type DefeatedBody = { group: THREE.Group; velocity: THREE.Vector3; life: number; spin: number };
type PendingStrike = { at: number; radius: number; damage: number; fullCircle: boolean; color: number };

type DropKind = 'power' | 'tempo' | 'repair';
type Drop3D = { kind: DropKind; group: THREE.Group; bobOffset: number; expiresAt: number };

type BattleData = { instrumentId?: InstrumentId };

const worldHalfX = 32;
const worldHalfZ = 23;
const playerRadius = 0.7;
const bossLevels = 5;
const maxLivingEnemies = 62;

function clampDelta(delta: number) {
  return Math.min(0.033, delta / 1000);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
    else child.material.dispose();
  });
  object.removeFromParent();
}

function material(color: number, roughness = 0.72, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function mesh(geometry: THREE.BufferGeometry, color: number, roughness?: number, metalness?: number) {
  return new THREE.Mesh(geometry, material(color, roughness, metalness));
}

function createInstrumentModel(id: InstrumentId) {
  const group = new THREE.Group();
  if (id === 'electric-guitar' || id === 'bass') {
    const mainColor = id === 'electric-guitar' ? 0xf5c542 : 0x38bdf8;
    const bodyA = mesh(new THREE.SphereGeometry(0.34, 10, 8), mainColor, 0.4, 0.28);
    bodyA.scale.set(1.15, 1.45, 0.42);
    const bodyB = bodyA.clone();
    bodyB.position.y = -0.3;
    bodyB.scale.set(0.92, 1.1, 0.42);
    const neck = mesh(new THREE.BoxGeometry(0.13, id === 'bass' ? 1.75 : 1.5, 0.11), 0x8b5a2b, 0.5);
    neck.position.y = 1.05;
    const head = mesh(new THREE.BoxGeometry(0.23, 0.36, 0.13), mainColor, 0.45, 0.2);
    head.position.y = id === 'bass' ? 2.05 : 1.84;
    group.add(bodyA, bodyB, neck, head);
    group.scale.setScalar(0.88);
  } else if (id === 'drum-sticks') {
    for (const x of [-0.12, 0.12]) {
      const stick = mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.7, 8), 0xf2d19b, 0.82);
      stick.position.x = x;
      stick.rotation.z = x * 0.65;
      group.add(stick);
    }
  } else {
    const board = mesh(new THREE.BoxGeometry(1.55, 0.38, 0.32), 0x3b2b58, 0.44, 0.1);
    group.add(board);
    for (let index = 0; index < 9; index += 1) {
      const key = mesh(new THREE.BoxGeometry(0.13, 0.08, 0.27), index % 3 === 1 ? 0x111827 : 0xf8fafc, 0.3);
      key.position.set(-0.59 + index * 0.148, 0.23, 0);
      group.add(key);
    }
  }
  group.rotation.z = -0.35;
  group.rotation.x = 0.2;
  return group;
}

function createChibiPlayer(instrumentId: InstrumentId) {
  const root = new THREE.Group();
  const body = mesh(new THREE.CapsuleGeometry(0.52, 0.72, 5, 10), 0x334155, 0.86);
  body.position.y = 1.25;
  const shirt = mesh(new THREE.CapsuleGeometry(0.56, 0.45, 5, 10), instrumentById.get(instrumentId)!.color, 0.76);
  shirt.position.y = 1.32;
  const head = mesh(new THREE.SphereGeometry(0.66, 16, 12), 0xffd5b5, 0.92);
  head.position.y = 2.42;
  const hair = mesh(new THREE.SphereGeometry(0.69, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56), 0x28211d, 0.94);
  hair.position.y = 2.62;
  const eyeGeometry = new THREE.SphereGeometry(0.055, 8, 6);
  for (const x of [-0.22, 0.22]) {
    const eye = mesh(eyeGeometry, 0x111827, 0.35);
    eye.position.set(x, 2.48, 0.61);
    root.add(eye);
  }
  const legGeometry = new THREE.CapsuleGeometry(0.15, 0.46, 4, 8);
  for (const x of [-0.27, 0.27]) {
    const leg = mesh(legGeometry, 0x172033, 0.9);
    leg.position.set(x, 0.45, 0);
    root.add(leg);
  }
  const leftArm = mesh(new THREE.CapsuleGeometry(0.13, 0.58, 4, 8), 0xffd5b5, 0.9);
  leftArm.position.set(-0.62, 1.45, 0.08);
  leftArm.rotation.z = -0.35;
  root.add(body, shirt, head, hair, leftArm);

  const weaponPivot = new THREE.Group();
  weaponPivot.position.set(0.58, 1.58, 0.18);
  const rightArm = mesh(new THREE.CapsuleGeometry(0.13, 0.58, 4, 8), 0xffd5b5, 0.9);
  rightArm.position.y = -0.15;
  rightArm.rotation.z = 0.5;
  const weapon = createInstrumentModel(instrumentId);
  weapon.position.set(0.28, -0.15, 0.28);
  weapon.rotation.z += Math.PI * 0.08;
  weapon.scale.multiplyScalar(instrumentId === 'keyboard' ? 0.72 : 0.78);
  weaponPivot.add(rightArm, weapon);
  root.add(weaponPivot);
  root.scale.setScalar(0.9);
  return { root, weaponPivot, leftArm };
}

function createEnemyModel(kind: EnemyKind, color: number) {
  const group = new THREE.Group();
  if (kind === 'walker') {
    const body = mesh(new THREE.CapsuleGeometry(0.43, 0.62, 4, 8), color);
    body.position.y = 0.82;
    const head = mesh(new THREE.SphereGeometry(0.42, 10, 8), 0xe2e8f0);
    head.position.y = 1.7;
    group.add(body, head);
  } else if (kind === 'charger') {
    const body = mesh(new THREE.CapsuleGeometry(0.5, 0.65, 4, 8), color, 0.6, 0.15);
    body.position.y = 0.9;
    const horn = mesh(new THREE.ConeGeometry(0.26, 0.85, 8), 0xf8fafc, 0.48);
    horn.rotation.x = Math.PI / 2;
    horn.position.set(0, 1.2, 0.68);
    group.add(body, horn);
  } else if (kind === 'ranged') {
    const speaker = mesh(new THREE.BoxGeometry(1.05, 1.35, 0.75), 0x252b3b, 0.54, 0.2);
    speaker.position.y = 0.85;
    const cone = mesh(new THREE.CylinderGeometry(0.3, 0.44, 0.12, 14), color, 0.42, 0.15);
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, 0.92, 0.43);
    group.add(speaker, cone);
  } else if (kind === 'brute') {
    const body = mesh(new THREE.DodecahedronGeometry(0.9, 0), color, 0.68, 0.1);
    body.position.y = 1.05;
    const jaw = mesh(new THREE.BoxGeometry(0.9, 0.3, 0.45), 0x111827);
    jaw.position.set(0, 0.77, 0.7);
    group.add(body, jaw);
  } else {
    const body = mesh(new THREE.CylinderGeometry(0.42, 0.62, 1.25, 9), 0x34d399, 0.74);
    body.position.y = 0.78;
    const halo = mesh(new THREE.TorusGeometry(0.52, 0.08, 6, 18), 0xa7f3d0, 0.35, 0.12);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.7;
    group.add(body, halo);
  }
  return group;
}

function createBossModel(kind: BossKind, color: number) {
  const group = new THREE.Group();
  if (kind === 'amp-shroom') {
    const stem = mesh(new THREE.CapsuleGeometry(0.72, 1.25, 5, 12), 0xf5e8d0, 0.9);
    stem.position.y = 1.25;
    const cap = mesh(new THREE.SphereGeometry(1.55, 14, 9), color, 0.75);
    cap.scale.y = 0.47;
    cap.position.y = 2.55;
    const amp = mesh(new THREE.BoxGeometry(1.15, 1.0, 0.65), 0x191b24, 0.5, 0.2);
    amp.position.set(0, 1.2, 0.72);
    group.add(stem, cap, amp);
  } else if (kind === 'clockwork-maestro') {
    const coat = mesh(new THREE.CylinderGeometry(0.72, 1.05, 2.2, 10), 0x5b214e, 0.72);
    coat.position.y = 1.2;
    const head = mesh(new THREE.SphereGeometry(0.7, 12, 9), 0xffd5b5, 0.9);
    head.position.y = 2.75;
    for (const x of [-0.72, -0.48, 0.48, 0.72]) {
      const curl = mesh(new THREE.TorusGeometry(0.23, 0.1, 6, 12), 0xf8fafc, 0.9);
      curl.position.set(x, 2.9, 0);
      curl.rotation.y = Math.PI / 2;
      group.add(curl);
    }
    const baton = mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.3, 7), 0xfacc15, 0.4, 0.25);
    baton.position.set(0.95, 1.65, 0.35);
    baton.rotation.z = -0.45;
    group.add(coat, head, baton);
  } else {
    const body = mesh(new THREE.CapsuleGeometry(0.82, 1.35, 5, 12), 0x171527, 0.35, 0.32);
    body.position.y = 1.35;
    const visor = mesh(new THREE.BoxGeometry(1.25, 0.28, 0.35), 0x22d3ee, 0.2, 0.4);
    visor.position.set(0, 2.35, 0.62);
    const coat = mesh(new THREE.ConeGeometry(1.35, 2.2, 9, 1, true), color, 0.5, 0.18);
    coat.position.y = 0.95;
    group.add(body, visor, coat);
  }
  return group;
}

export class SurvivalBattleScene extends Phaser.Scene {
  private instrumentId: InstrumentId = 'electric-guitar';
  private progress: SurvivalProgress = loadSurvivalProgress();
  private totalLevel = 0;
  private maxUnlockedThreat = 4;
  private scene3d?: THREE.Scene;
  private camera3d?: THREE.PerspectiveCamera;
  private threeRenderer?: THREE.WebGLRenderer;
  private player?: THREE.Group;
  private weaponPivot?: THREE.Group;
  private floor?: THREE.Mesh;
  private uiRoot?: HTMLDivElement;
  private statLine?: HTMLDivElement;
  private conditionLine?: HTMLDivElement;
  private centerNotice?: HTMLDivElement;
  private comboLine?: HTMLDivElement;
  private evolutionLine?: HTMLDivElement;
  private enemies: Enemy3D[] = [];
  private projectiles: PlayerProjectile[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private impacts: Impact[] = [];
  private particles: Particle[] = [];
  private defeatedBodies: DefeatedBody[] = [];
  private drops: Drop3D[] = [];
  private pendingStrikes: PendingStrike[] = [];
  private keys = new Set<string>();
  private playerPosition = new THREE.Vector3(0, 0, 0);
  private aimDirection = new THREE.Vector3(0, 0, 1);
  private attackElapsed = 0;
  private attacking = false;
  private attackApplied = false;
  private nextAttackAt = 0;
  private runTime = 0;
  private threat = 1;
  private highestThreat = 1;
  private nextThreatAt = 0;
  private pendingAdvanceAt = 0;
  private enemyId = 0;
  private maxCondition = 120;
  private condition = 120;
  private attackDamage = 24;
  private attackRange = 3.4;
  private attackCooldown = 0.52;
  private moveSpeed = 8;
  private runCoins = 0;
  private kills = 0;
  private runMaterials: Partial<Record<MaterialId, number>> = {};
  private powerUntil = 0;
  private tempoUntil = 0;
  private hitStopRemaining = 0;
  private cameraShake = 0;
  private combo = 0;
  private comboUntil = 0;
  private runEnded = false;
  private resizeHandler = () => this.resizeRenderer();
  private keyDownHandler = (event: KeyboardEvent) => this.onKeyDown(event);
  private keyUpHandler = (event: KeyboardEvent) => this.keys.delete(event.code);
  private pointerHandler = () => this.requestAttack();

  constructor() {
    super('SurvivalBattleScene');
  }

  init(data: BattleData = {}) {
    if (data.instrumentId && instrumentById.has(data.instrumentId)) this.instrumentId = data.instrumentId;
  }

  create() {
    this.resetRun();
    this.progress = loadSurvivalProgress();
    this.totalLevel = getTotalLevel(this.progress);
    this.maxUnlockedThreat = getThreatUnlockForTotalLevel(this.totalLevel);
    this.threat = getRecommendedStartingThreat(this.totalLevel, this.maxUnlockedThreat);
    this.highestThreat = this.threat;
    const common = this.progress.commonLevels;
    this.maxCondition = 120 + common.condition * 18;
    this.condition = this.maxCondition;
    this.attackDamage = 24 * (1 + common.attack * 0.15);
    this.attackRange = 3.25 * (1 + common.range * 0.1);
    this.attackCooldown = 0.52 / (1 + common.attackSpeed * 0.1);
    this.moveSpeed = 7.7 * (1 + common.moveSpeed * 0.06);
    this.createThreeWorld();
    this.createDomHud();
    this.bindInputs();
    this.nextThreatAt = 24;
    this.spawnThreat(this.threat);
    this.showNotice(`敵水準 ${this.threat}　演奏開始！`, '#fde047');
    this.showEvolution(`攻撃段階：${this.getEvolutionStage()}`, '#bae6fd');
    if (this.threat > 1) this.showEvolution(`総Lv.${this.totalLevel}により開始水準${this.threat}`, '#7dd3fc');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  update(_time: number, delta: number) {
    if (!this.threeRenderer || !this.scene3d || !this.camera3d || !this.player || this.runEnded) return;
    const dt = clampDelta(delta);
    this.runTime += dt;
    this.updatePlayer(dt);
    this.updateAttack(dt);
    if (this.hitStopRemaining > 0) this.hitStopRemaining -= dt;
    else {
      this.updatePendingStrikes();
      this.updateProjectiles(dt);
      this.updateEnemyProjectiles(dt);
      this.updateEnemies(dt);
      this.updateDrops(dt);
    }
    this.updateEffects(dt);
    this.updateCamera(dt);
    this.updateProgression();
    this.updateHud();
    this.threeRenderer.render(this.scene3d, this.camera3d);
  }

  private resetRun() {
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.impacts = [];
    this.particles = [];
    this.defeatedBodies = [];
    this.drops = [];
    this.pendingStrikes = [];
    this.keys.clear();
    this.playerPosition.set(0, 0, 0);
    this.aimDirection.set(0, 0, 1);
    this.attackElapsed = 0;
    this.attacking = false;
    this.attackApplied = false;
    this.nextAttackAt = 0;
    this.runTime = 0;
    this.pendingAdvanceAt = 0;
    this.enemyId = 0;
    this.runCoins = 0;
    this.kills = 0;
    this.runMaterials = {};
    this.powerUntil = 0;
    this.tempoUntil = 0;
    this.hitStopRemaining = 0;
    this.cameraShake = 0;
    this.combo = 0;
    this.comboUntil = 0;
    this.runEnded = false;
  }

  private createThreeWorld() {
    const host = document.getElementById('game') ?? document.body;
    host.style.position = 'relative';
    this.scene3d = new THREE.Scene();
    this.scene3d.background = new THREE.Color(0x07121c);
    this.scene3d.fog = new THREE.Fog(0x07121c, 34, 65);
    this.camera3d = new THREE.PerspectiveCamera(48, 1, 0.1, 130);
    this.threeRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.threeRenderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    this.threeRenderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:20;width:100%;height:100%;touch-action:none;';
    host.appendChild(this.threeRenderer.domElement);
    this.resizeRenderer();

    this.scene3d.add(new THREE.HemisphereLight(0xb9e6ff, 0x1c2131, 2.0));
    const sun = new THREE.DirectionalLight(0xfff1d6, 2.6);
    sun.position.set(-10, 18, 12);
    this.scene3d.add(sun);
    const rim = new THREE.DirectionalLight(instrumentById.get(this.instrumentId)!.color, 1.35);
    rim.position.set(12, 8, -8);
    this.scene3d.add(rim);

    this.floor = mesh(new THREE.PlaneGeometry(worldHalfX * 2 + 5, worldHalfZ * 2 + 5), 0x132536, 0.94);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.03;
    this.scene3d.add(this.floor);
    const grid = new THREE.GridHelper(70, 35, 0x315a72, 0x1b3447);
    grid.position.y = 0;
    this.scene3d.add(grid);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
    const borderPoints = [
      new THREE.Vector3(-worldHalfX, 0.05, -worldHalfZ), new THREE.Vector3(worldHalfX, 0.05, -worldHalfZ),
      new THREE.Vector3(worldHalfX, 0.05, worldHalfZ), new THREE.Vector3(-worldHalfX, 0.05, worldHalfZ),
      new THREE.Vector3(-worldHalfX, 0.05, -worldHalfZ),
    ];
    this.scene3d.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(borderPoints), borderMaterial));

    const chibi = createChibiPlayer(this.instrumentId);
    this.player = chibi.root;
    this.weaponPivot = chibi.weaponPivot;
    this.scene3d.add(this.player);
  }

  private createDomHud() {
    const host = document.getElementById('game') ?? document.body;
    const root = document.createElement('div');
    root.style.cssText = 'position:absolute;inset:0;z-index:30;pointer-events:none;color:#f8fafc;font-family:system-ui,sans-serif;text-shadow:0 2px 4px #000;';
    root.innerHTML = `
      <div data-role="stats" style="position:absolute;left:20px;top:18px;min-width:330px;padding:12px 16px;background:#020617cc;border:2px solid #31536f;border-radius:12px;font-weight:700"></div>
      <div data-role="condition" style="position:absolute;left:20px;top:104px;width:330px"></div>
      <div data-role="notice" style="position:absolute;left:50%;top:42px;transform:translateX(-50%);font-size:26px;font-weight:900;text-align:center;transition:opacity .35s"></div>
      <div data-role="combo" style="position:absolute;right:28px;top:24px;font-size:28px;font-weight:900;text-align:right;color:#fde047"></div>
      <div data-role="evolution" style="position:absolute;left:50%;bottom:90px;transform:translateX(-50%);padding:9px 18px;background:#020617d9;border:1px solid #64748b;border-radius:10px;font-size:18px;font-weight:800;opacity:0;transition:opacity .3s"></div>
      <div style="position:absolute;right:22px;bottom:18px;padding:8px 12px;background:#020617b8;border-radius:8px;font-size:14px">WASD/矢印 移動　Space/J/クリック 攻撃　Esc 撤退</div>
    `;
    host.appendChild(root);
    this.uiRoot = root;
    this.statLine = root.querySelector('[data-role="stats"]') as HTMLDivElement;
    this.conditionLine = root.querySelector('[data-role="condition"]') as HTMLDivElement;
    this.centerNotice = root.querySelector('[data-role="notice"]') as HTMLDivElement;
    this.comboLine = root.querySelector('[data-role="combo"]') as HTMLDivElement;
    this.evolutionLine = root.querySelector('[data-role="evolution"]') as HTMLDivElement;
  }

  private bindInputs() {
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
    window.addEventListener('resize', this.resizeHandler);
    this.threeRenderer?.domElement.addEventListener('pointerdown', this.pointerHandler);
  }

  private onKeyDown(event: KeyboardEvent) {
    this.keys.add(event.code);
    if (['Space', 'KeyJ'].includes(event.code)) {
      event.preventDefault();
      this.requestAttack();
    }
    if (event.code === 'Escape') this.finishRun('撤退');
  }

  private resizeRenderer() {
    if (!this.threeRenderer || !this.camera3d) return;
    const host = document.getElementById('game');
    const width = Math.max(800, host?.clientWidth ?? window.innerWidth);
    const height = Math.max(600, host?.clientHeight ?? window.innerHeight);
    this.threeRenderer.setSize(width, height, false);
    this.camera3d.aspect = width / height;
    this.camera3d.updateProjectionMatrix();
  }

  private updatePlayer(dt: number) {
    if (!this.player) return;
    let x = 0;
    let z = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z += 1;
    const move = new THREE.Vector3(x, 0, z);
    if (move.lengthSq() > 0) {
      move.normalize();
      this.playerPosition.addScaledVector(move, this.moveSpeed * dt);
      this.playerPosition.x = THREE.MathUtils.clamp(this.playerPosition.x, -worldHalfX, worldHalfX);
      this.playerPosition.z = THREE.MathUtils.clamp(this.playerPosition.z, -worldHalfZ, worldHalfZ);
      if (!this.attacking) this.aimDirection.lerp(move, 0.24).normalize();
    }
    this.player.position.copy(this.playerPosition);
    this.player.position.y = Math.abs(Math.sin(this.runTime * 9)) * (move.lengthSq() > 0 ? 0.09 : 0.025);
    this.player.rotation.y = Math.atan2(this.aimDirection.x, this.aimDirection.z);
  }

  private requestAttack() {
    if (this.runEnded || this.attacking || this.runTime < this.nextAttackAt) return;
    this.aimAtNearest();
    this.attacking = true;
    this.attackApplied = false;
    this.attackElapsed = 0;
    const tempo = this.runTime < this.tempoUntil ? 1.35 : 1;
    this.nextAttackAt = this.runTime + this.attackCooldown / tempo;
    const soundKey = this.instrumentId === 'electric-guitar' ? 'attack-electric-guitar-normal-01'
      : this.instrumentId === 'bass' ? 'attack-bass-normal-01'
        : this.instrumentId === 'drum-sticks' ? 'attack-drum-sticks-vs-wood-normal-01'
          : 'attack-keyboard-normal-01';
    if (this.cache.audio.exists(soundKey)) this.sound.play(soundKey, { volume: 0.32 });
  }

  private aimAtNearest() {
    let nearest: Enemy3D | undefined;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (const enemy of this.enemies) {
      const distance = enemy.group.position.distanceToSquared(this.playerPosition);
      if (distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    }
    if (!nearest) return;
    this.aimDirection.copy(nearest.group.position).sub(this.playerPosition).setY(0).normalize();
  }

  private updateAttack(dt: number) {
    if (!this.attacking || !this.weaponPivot) return;
    this.attackElapsed += dt;
    const duration = this.instrumentId === 'bass' ? 0.42 : this.instrumentId === 'drum-sticks' ? 0.2 : 0.31;
    const phase = Math.min(1, this.attackElapsed / duration);
    const swing = Math.sin(phase * Math.PI);
    this.weaponPivot.rotation.z = -1.1 + swing * 2.45;
    this.weaponPivot.rotation.x = 0.15 + swing * 0.52;
    if (!this.attackApplied && phase >= 0.32) {
      this.attackApplied = true;
      this.applyInstrumentAttack();
    }
    if (phase >= 1) {
      this.attacking = false;
      this.weaponPivot.rotation.set(0, 0, 0);
    }
  }

  private applyInstrumentAttack() {
    const specialty = this.progress.instruments[this.instrumentId].specialtyLevel;
    const power = this.runTime < this.powerUntil ? 1.35 : 1;
    const damage = this.attackDamage * power;
    const color = instrumentById.get(this.instrumentId)!.color;
    if (this.instrumentId === 'electric-guitar') {
      this.meleeStrike(this.attackRange, damage, false, color, 1.2);
      if (specialty >= 1) this.spawnSoundWave(damage * 0.7, specialty, color);
      if (specialty >= 5) {
        const sideA = this.aimDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.24);
        const sideB = this.aimDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.24);
        this.spawnSoundWave(damage * 0.52, specialty, color, sideA);
        this.spawnSoundWave(damage * 0.52, specialty, color, sideB);
      }
    } else if (this.instrumentId === 'bass') {
      this.meleeStrike(this.attackRange * (1.12 + specialty * 0.06), damage * (1.25 + specialty * 0.06), false, color, 2.1 + specialty * 0.2);
    } else if (this.instrumentId === 'drum-sticks') {
      const hits = 2 + Math.min(4, specialty);
      for (let hit = 0; hit < hits; hit += 1) {
        this.pendingStrikes.push({ at: this.runTime + hit * 0.07, radius: this.attackRange * (specialty >= 2 ? 1.02 : 0.72), damage: damage * 0.42, fullCircle: specialty >= 2, color });
      }
    } else {
      const notes = 3 + Math.min(6, specialty);
      for (let note = 0; note < notes; note += 1) {
        const angle = (note - (notes - 1) / 2) * 0.15;
        const direction = this.aimDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        this.spawnSoundWave(damage * 0.58, Math.max(1, specialty), color, direction, 10.5);
      }
    }
  }

  private updatePendingStrikes() {
    for (let index = this.pendingStrikes.length - 1; index >= 0; index -= 1) {
      const strike = this.pendingStrikes[index];
      if (this.runTime < strike.at) continue;
      this.meleeStrike(strike.radius, strike.damage, strike.fullCircle, strike.color, 0.8);
      this.pendingStrikes.splice(index, 1);
    }
  }

  private meleeStrike(radius: number, damage: number, fullCircle: boolean, color: number, force: number) {
    const center = fullCircle ? this.playerPosition.clone() : this.playerPosition.clone().addScaledVector(this.aimDirection, radius * 0.48);
    this.spawnImpact(center, radius, color);
    let hits = 0;
    for (const enemy of [...this.enemies]) {
      const offset = enemy.group.position.clone().sub(center).setY(0);
      if (offset.length() > radius + enemy.radius) continue;
      if (!fullCircle) {
        const fromPlayer = enemy.group.position.clone().sub(this.playerPosition).setY(0).normalize();
        if (fromPlayer.dot(this.aimDirection) < -0.12) continue;
      }
      this.damageEnemy(enemy, damage, offset.normalize().multiplyScalar(force));
      hits += 1;
    }
    if (hits >= 3) {
      this.hitStopRemaining = Math.max(this.hitStopRemaining, 0.045);
      this.cameraShake = Math.max(this.cameraShake, Math.min(0.65, 0.15 + hits * 0.035));
    }
  }

  private spawnSoundWave(damage: number, specialty: number, color: number, direction = this.aimDirection.clone(), speed = 13.5) {
    const ringMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
    const wave = new THREE.Mesh(new THREE.TorusGeometry(0.52 + specialty * 0.055, 0.13, 7, 20), ringMaterial);
    wave.rotation.x = Math.PI / 2;
    wave.position.copy(this.playerPosition).addScaledVector(direction, 1.1).setY(0.65);
    this.scene3d?.add(wave);
    this.projectiles.push({
      mesh: wave,
      direction: direction.normalize(),
      speed,
      damage,
      radius: 0.72 + specialty * 0.08,
      traveled: 0,
      maxDistance: 9 + this.progress.commonLevels.range * 0.7 + specialty * 1.1,
      distanceRetention: Math.min(0.97, 0.64 + specialty * 0.055),
      penetrationRetention: Math.min(0.96, 0.7 + specialty * 0.045),
      remainingPierce: 1 + specialty,
      hitIds: new Set(),
      color,
    });
  }

  private updateProjectiles(dt: number) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      const distanceStep = projectile.speed * dt;
      projectile.mesh.position.addScaledVector(projectile.direction, distanceStep);
      projectile.traveled += distanceStep;
      projectile.mesh.rotation.z += dt * 8;
      for (const enemy of [...this.enemies]) {
        if (projectile.hitIds.has(enemy.id)) continue;
        if (enemy.group.position.distanceTo(projectile.mesh.position) > enemy.radius + projectile.radius) continue;
        projectile.hitIds.add(enemy.id);
        const distanceFactor = Math.pow(projectile.distanceRetention, projectile.traveled / 3.2);
        this.damageEnemy(enemy, projectile.damage * distanceFactor, projectile.direction.clone().multiplyScalar(1.5));
        projectile.damage *= projectile.penetrationRetention;
        projectile.remainingPierce -= 1;
        if (projectile.remainingPierce <= 0) break;
      }
      const material = projectile.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0.12, 0.82 * (1 - projectile.traveled / projectile.maxDistance));
      if (projectile.traveled >= projectile.maxDistance || projectile.remainingPierce <= 0) {
        disposeObject(projectile.mesh);
        this.projectiles.splice(index, 1);
      }
    }
  }

  private damageEnemy(enemy: Enemy3D, damage: number, knockback: THREE.Vector3) {
    if (!this.enemies.includes(enemy)) return;
    enemy.hp -= damage;
    enemy.knockback.add(knockback.multiplyScalar(enemy.boss ? 0.42 : enemy.kind === 'brute' ? 0.58 : 1));
    this.spawnHitParticles(enemy.group.position, instrumentById.get(this.instrumentId)!.color, enemy.boss ? 8 : 4);
    if (enemy.healthBar) enemy.healthBar.scale.x = Math.max(0, enemy.hp / enemy.maxHp);
    if (enemy.hp <= 0) this.defeatEnemy(enemy);
  }

  private defeatEnemy(enemy: Enemy3D) {
    const index = this.enemies.indexOf(enemy);
    if (index < 0) return;
    this.enemies.splice(index, 1);
    this.runCoins += enemy.coinValue;
    this.kills += 1;
    this.combo = this.runTime <= this.comboUntil ? this.combo + 1 : 1;
    this.comboUntil = this.runTime + 2.2;
    const selectedMaterial = instrumentById.get(this.instrumentId)!.materialId;
    if (enemy.instrumentId === this.instrumentId && (enemy.boss || Math.random() < 0.24)) {
      const amount = enemy.boss ? (this.threat % 10 === 0 ? 4 : 2) : 1;
      this.runMaterials[selectedMaterial] = (this.runMaterials[selectedMaterial] ?? 0) + amount;
      this.showEvolution(`+${amount} ${instrumentById.get(this.instrumentId)!.materialName}`, '#fde047');
    }
    if (enemy.boss || Math.random() < 0.085) this.spawnDrop(enemy.group.position);
    const launch = enemy.knockback.lengthSq() > 0 ? enemy.knockback.clone() : enemy.group.position.clone().sub(this.playerPosition).setY(0).normalize().multiplyScalar(3);
    launch.y = enemy.boss ? 5 : 3.2;
    this.defeatedBodies.push({ group: enemy.group, velocity: launch, life: enemy.boss ? 1.2 : 0.62, spin: (Math.random() - 0.5) * 9 });
    this.spawnHitParticles(enemy.group.position, 0xfde047, enemy.boss ? 30 : 10);
    this.hitStopRemaining = Math.max(this.hitStopRemaining, enemy.boss ? 0.12 : 0.025);
    this.cameraShake = Math.max(this.cameraShake, enemy.boss ? 1.1 : 0.22);
    if (enemy.boss) this.showNotice(`${this.getBossName(enemy.bossKind)} 撃破！`, '#fde047');
  }

  private updateEnemies(dt: number) {
    for (const enemy of [...this.enemies]) {
      const toPlayer = this.playerPosition.clone().sub(enemy.group.position).setY(0);
      const distance = Math.max(0.001, toPlayer.length());
      const direction = toPlayer.normalize();
      if (enemy.knockback.lengthSq() > 0.01) {
        enemy.group.position.addScaledVector(enemy.knockback, dt);
        enemy.knockback.multiplyScalar(Math.pow(0.03, dt));
      } else if (enemy.boss) {
        this.updateBoss(enemy, direction, distance, dt);
      } else if (enemy.kind === 'charger') {
        this.updateCharger(enemy, direction, dt);
      } else if (enemy.kind === 'ranged') {
        if (distance < 7) enemy.group.position.addScaledVector(direction, -enemy.speed * 0.65 * dt);
        else if (distance > 11) enemy.group.position.addScaledVector(direction, enemy.speed * dt);
        if (this.runTime >= enemy.nextActionAt) {
          enemy.nextActionAt = this.runTime + 2.0 + Math.random() * 0.6;
          this.spawnEnemyProjectile(enemy.group.position, direction, enemy.damage * 0.75, 7.5, 0xf87171);
        }
      } else if (enemy.kind === 'support') {
        enemy.group.rotation.y += dt * 2.5;
        if (this.runTime >= enemy.nextActionAt) {
          enemy.nextActionAt = this.runTime + 3.5;
          for (const ally of this.enemies) {
            if (ally === enemy || ally.group.position.distanceTo(enemy.group.position) > 5.5) continue;
            ally.hp = Math.min(ally.maxHp, ally.hp + ally.maxHp * 0.12);
            if (ally.healthBar) ally.healthBar.scale.x = ally.hp / ally.maxHp;
          }
          this.spawnImpact(enemy.group.position, 5.5, 0x34d399);
        }
        if (distance < 8) enemy.group.position.addScaledVector(direction, -enemy.speed * 0.5 * dt);
      } else {
        enemy.group.position.addScaledVector(direction, enemy.speed * dt);
      }
      enemy.group.position.x = THREE.MathUtils.clamp(enemy.group.position.x, -worldHalfX - 1, worldHalfX + 1);
      enemy.group.position.z = THREE.MathUtils.clamp(enemy.group.position.z, -worldHalfZ - 1, worldHalfZ + 1);
      if (!enemy.boss) enemy.group.rotation.y = Math.atan2(direction.x, direction.z);
      const currentDistance = enemy.group.position.distanceTo(this.playerPosition);
      if (currentDistance <= enemy.radius + playerRadius && this.runTime >= enemy.nextContactAt) {
        enemy.nextContactAt = this.runTime + (enemy.boss ? 0.68 : 0.9);
        this.damagePlayer(enemy.damage);
      }
    }
  }

  private updateCharger(enemy: Enemy3D, direction: THREE.Vector3, dt: number) {
    if (enemy.state === 'seek' && this.runTime >= enemy.nextActionAt) {
      enemy.state = 'telegraph';
      enemy.stateUntil = this.runTime + 0.7;
      enemy.dashDirection.copy(direction);
      this.spawnImpact(enemy.group.position, 1.5, 0xfb923c);
    } else if (enemy.state === 'telegraph' && this.runTime >= enemy.stateUntil) {
      enemy.state = 'dash';
      enemy.stateUntil = this.runTime + 0.55;
    } else if (enemy.state === 'dash') {
      enemy.group.position.addScaledVector(enemy.dashDirection, enemy.speed * 4.2 * dt);
      if (this.runTime >= enemy.stateUntil) {
        enemy.state = 'seek';
        enemy.nextActionAt = this.runTime + 2.3;
      }
    } else if (enemy.state === 'seek') enemy.group.position.addScaledVector(direction, enemy.speed * dt);
  }

  private updateBoss(enemy: Enemy3D, direction: THREE.Vector3, distance: number, dt: number) {
    enemy.group.rotation.y += dt * 0.7;
    if (this.runTime >= enemy.nextActionAt) {
      if (enemy.bossKind === 'amp-shroom') {
        this.spawnImpact(enemy.group.position, 5.2, 0xf97316);
        if (distance < 5.8) this.damagePlayer(enemy.damage * 1.25);
        for (let i = 0; i < 8; i += 1) {
          const angle = i / 8 * Math.PI * 2;
          this.spawnEnemyProjectile(enemy.group.position, new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)), enemy.damage * 0.55, 6, 0xfb923c);
        }
        enemy.nextActionAt = this.runTime + 3.1;
      } else if (enemy.bossKind === 'clockwork-maestro') {
        for (let i = 0; i < 14; i += 1) {
          const angle = i / 14 * Math.PI * 2 + this.runTime * 0.4;
          this.spawnEnemyProjectile(enemy.group.position, new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)), enemy.damage * 0.48, 7.2, 0xc084fc);
        }
        enemy.nextActionAt = this.runTime + 2.45;
      } else {
        for (let i = -3; i <= 3; i += 1) {
          const shot = direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), i * 0.13);
          this.spawnEnemyProjectile(enemy.group.position, shot, enemy.damage * 0.58, 9, 0x22d3ee);
        }
        enemy.nextActionAt = this.runTime + 1.85;
      }
    }
    if (distance > 5.5) enemy.group.position.addScaledVector(direction, enemy.speed * dt);
  }

  private spawnEnemyProjectile(position: THREE.Vector3, direction: THREE.Vector3, damage: number, speed: number, color: number) {
    const shot = mesh(new THREE.SphereGeometry(0.22, 8, 6), color, 0.3, 0.2);
    shot.position.copy(position).setY(0.75);
    this.scene3d?.add(shot);
    this.enemyProjectiles.push({ mesh: shot, velocity: direction.clone().normalize().multiplyScalar(speed), radius: 0.24, damage, life: 4 });
  }

  private updateEnemyProjectiles(dt: number) {
    for (let index = this.enemyProjectiles.length - 1; index >= 0; index -= 1) {
      const shot = this.enemyProjectiles[index];
      shot.mesh.position.addScaledVector(shot.velocity, dt);
      shot.life -= dt;
      if (shot.mesh.position.distanceTo(this.playerPosition) <= shot.radius + playerRadius) {
        this.damagePlayer(shot.damage);
        shot.life = 0;
      }
      if (shot.life <= 0) {
        disposeObject(shot.mesh);
        this.enemyProjectiles.splice(index, 1);
      }
    }
  }

  private damagePlayer(damage: number) {
    this.condition = Math.max(0, this.condition - damage);
    this.cameraShake = Math.max(this.cameraShake, 0.45);
    this.spawnHitParticles(this.playerPosition, 0xef4444, 8);
    if (this.condition <= 0) this.finishRun('コンディション切れ');
  }

  private spawnThreat(level: number) {
    const isBossLevel = level % bossLevels === 0;
    const baseCount = Math.min(58, 10 + level * 3);
    const desiredCount = isBossLevel ? Math.max(8, Math.floor(baseCount * 0.45)) : baseCount;
    const reservedForBoss = isBossLevel ? 1 : 0;
    const count = Math.max(0, Math.min(desiredCount, maxLivingEnemies - this.enemies.length - reservedForBoss));
    for (let index = 0; index < count; index += 1) this.spawnEnemy(level, this.pickEnemyKind(level));
    if (isBossLevel) this.spawnBoss(level);
    this.nextThreatAt = this.runTime + Math.max(15, 25 - level * 0.22);
    this.pendingAdvanceAt = 0;
  }

  private pickEnemyKind(level: number): EnemyKind {
    const roll = Math.random();
    if (level >= 8 && roll < 0.08) return 'support';
    if (level >= 6 && roll < 0.2) return 'brute';
    if (level >= 4 && roll < 0.36) return 'ranged';
    if (level >= 3 && roll < 0.56) return 'charger';
    return 'walker';
  }

  private spawnEnemy(level: number, kind: EnemyKind) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 8;
    const position = this.playerPosition.clone().add(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
    position.x = THREE.MathUtils.clamp(position.x, -worldHalfX, worldHalfX);
    position.z = THREE.MathUtils.clamp(position.z, -worldHalfZ, worldHalfZ);
    const instrument = instrumentById.get(instrumentDefinitionsAt(Math.floor(Math.random() * 4)))!;
    const group = createEnemyModel(kind, instrument.color);
    group.position.copy(position);
    this.scene3d?.add(group);
    const kindHp = kind === 'brute' ? 2.8 : kind === 'support' ? 1.6 : kind === 'charger' ? 1.25 : 1;
    const hp = 34 * (1 + level * 0.14) * kindHp;
    this.enemies.push({
      id: ++this.enemyId,
      kind,
      instrumentId: instrument.id,
      group,
      hp,
      maxHp: hp,
      speed: kind === 'brute' ? 1.65 : kind === 'ranged' || kind === 'support' ? 2.25 : 2.45 + Math.min(2.2, level * 0.08),
      radius: kind === 'brute' ? 0.95 : 0.62,
      damage: (7 + level * 0.48) * (kind === 'brute' ? 1.55 : 1),
      coinValue: Math.round((4 + level * 0.9) * (kind === 'brute' || kind === 'support' ? 1.8 : 1)),
      nextActionAt: this.runTime + 1.5 + Math.random() * 2,
      nextContactAt: 0,
      state: 'seek',
      stateUntil: 0,
      dashDirection: new THREE.Vector3(),
      knockback: new THREE.Vector3(),
      boss: false,
    });
  }

  private spawnBoss(level: number) {
    const bossKind: BossKind = level % 15 === 0 ? 'neon-conductor' : level % 10 === 0 ? 'clockwork-maestro' : 'amp-shroom';
    const instrument = instrumentById.get(this.instrumentId)!;
    const group = createBossModel(bossKind, instrument.color);
    group.position.copy(this.playerPosition).add(new THREE.Vector3(0, 0, -17));
    this.scene3d?.add(group);
    const hp = (bossKind === 'amp-shroom' ? 520 : 800) * (1 + level * 0.13);
    const healthBar = mesh(new THREE.BoxGeometry(4.6, 0.14, 0.12), 0x22c55e, 0.4);
    healthBar.position.set(0, 3.8, 0);
    healthBar.geometry.translate(2.3, 0, 0);
    group.add(healthBar);
    this.enemies.push({
      id: ++this.enemyId,
      kind: 'brute',
      instrumentId: this.instrumentId,
      group,
      hp,
      maxHp: hp,
      speed: bossKind === 'amp-shroom' ? 1.7 : 1.35,
      radius: 1.55,
      damage: 18 + level * 0.72,
      coinValue: 95 + level * 9,
      nextActionAt: this.runTime + 1.8,
      nextContactAt: 0,
      state: 'seek',
      stateUntil: 0,
      dashDirection: new THREE.Vector3(),
      knockback: new THREE.Vector3(),
      boss: true,
      bossKind,
      healthBar,
    });
    this.showNotice(`${this.getBossName(bossKind)}　襲来`, '#fb7185');
  }

  private getBossName(kind?: BossKind) {
    if (kind === 'clockwork-maestro') return '歯車楽長 クロック・マエストロ';
    if (kind === 'neon-conductor') return '電光指揮者 ネオン・ヴォルト';
    return '爆音茸 アンプシェル';
  }

  private updateProgression() {
    if (this.enemies.length === 0 && this.pendingAdvanceAt === 0) this.pendingAdvanceAt = this.runTime + 0.9;
    if (this.pendingAdvanceAt > 0 && this.runTime >= this.pendingAdvanceAt) {
      if (this.enemies.length === 0) this.advanceThreat('全滅突破');
      else this.pendingAdvanceAt = 0;
    }
    const bossAlive = this.enemies.some((enemy) => enemy.boss);
    if (!bossAlive && this.runTime >= this.nextThreatAt) this.advanceThreat('時間上昇');
  }

  private advanceThreat(reason: string) {
    if (this.enemies.some((enemy) => enemy.boss)) return;
    if (this.threat < this.maxUnlockedThreat) {
      this.threat += 1;
      this.highestThreat = Math.max(this.highestThreat, this.threat);
      this.showNotice(`${reason} → 敵水準 ${this.threat}${this.threat % bossLevels === 0 ? '　ボス水準！' : ''}`, this.threat % bossLevels === 0 ? '#fb7185' : '#fde047');
    } else {
      this.showNotice(`解放上限 ${this.maxUnlockedThreat}　限界演奏継続！`, '#c084fc');
      this.runCoins += Math.round(20 * (1 + this.threat * 0.12));
    }
    const heal = this.maxCondition * 0.035 * (1 + this.progress.commonLevels.recovery * 0.12);
    this.condition = Math.min(this.maxCondition, this.condition + heal);
    this.spawnThreat(this.threat);
  }

  private spawnDrop(position: THREE.Vector3) {
    const kinds: DropKind[] = ['power', 'tempo', 'repair'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const color = kind === 'power' ? 0xef4444 : kind === 'tempo' ? 0x38bdf8 : 0x22c55e;
    const group = new THREE.Group();
    const crystal = mesh(new THREE.OctahedronGeometry(0.42), color, 0.3, 0.25);
    crystal.position.y = 0.65;
    const ring = mesh(new THREE.TorusGeometry(0.55, 0.055, 6, 18), color, 0.3, 0.2);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.12;
    group.add(crystal, ring);
    group.position.copy(position).setY(0);
    this.scene3d?.add(group);
    this.drops.push({ kind, group, bobOffset: Math.random() * Math.PI * 2, expiresAt: this.runTime + 18 });
  }

  private updateDrops(dt: number) {
    for (let index = this.drops.length - 1; index >= 0; index -= 1) {
      const drop = this.drops[index];
      drop.group.rotation.y += dt * 2.2;
      drop.group.children[0].position.y = 0.65 + Math.sin(this.runTime * 3 + drop.bobOffset) * 0.14;
      if (this.runTime >= drop.expiresAt) {
        disposeObject(drop.group);
        this.drops.splice(index, 1);
        continue;
      }
      if (drop.group.position.distanceTo(this.playerPosition) > 1.35) continue;
      if (drop.kind === 'power') {
        this.powerUntil = this.runTime + 15;
        this.showEvolution('POWER UP　音圧+35% / 15秒', '#fca5a5');
      } else if (drop.kind === 'tempo') {
        this.tempoUntil = this.runTime + 15;
        this.showEvolution('TEMPO UP　攻撃速度+35% / 15秒', '#7dd3fc');
      } else {
        const recovery = 0.26 * (1 + this.progress.commonLevels.recovery * 0.12);
        this.condition = Math.min(this.maxCondition, this.condition + this.maxCondition * recovery);
        this.showEvolution('REPAIR　コンディション回復', '#86efac');
      }
      disposeObject(drop.group);
      this.drops.splice(index, 1);
    }
  }

  private spawnImpact(position: THREE.Vector3, radius: number, color: number) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.36, 0.55, 24),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(position).setY(0.07);
    this.scene3d?.add(ring);
    this.impacts.push({ mesh: ring, life: 0.24, maxLife: 0.24, maxScale: radius * 1.85 });
  }

  private spawnHitParticles(position: THREE.Vector3, color: number, count: number) {
    for (let i = 0; i < count; i += 1) {
      const particle = mesh(new THREE.SphereGeometry(0.055 + Math.random() * 0.07, 5, 4), color, 0.35, 0.1);
      particle.position.copy(position).add(new THREE.Vector3((Math.random() - 0.5) * 0.7, 0.5 + Math.random(), (Math.random() - 0.5) * 0.7));
      const velocity = new THREE.Vector3((Math.random() - 0.5) * 8, 2 + Math.random() * 5, (Math.random() - 0.5) * 8);
      this.scene3d?.add(particle);
      this.particles.push({ mesh: particle, velocity, life: 0.35 + Math.random() * 0.35, maxLife: 0.7 });
    }
  }

  private updateEffects(dt: number) {
    for (let index = this.impacts.length - 1; index >= 0; index -= 1) {
      const impact = this.impacts[index];
      impact.life -= dt;
      const progress = 1 - impact.life / impact.maxLife;
      impact.mesh.scale.setScalar(0.2 + impact.maxScale * progress);
      (impact.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.75 * (1 - progress));
      if (impact.life <= 0) {
        disposeObject(impact.mesh);
        this.impacts.splice(index, 1);
      }
    }
    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index];
      particle.life -= dt;
      particle.velocity.y -= 12 * dt;
      particle.mesh.position.addScaledVector(particle.velocity, dt);
      particle.mesh.scale.setScalar(Math.max(0.05, particle.life / particle.maxLife));
      if (particle.life <= 0) {
        disposeObject(particle.mesh);
        this.particles.splice(index, 1);
      }
    }
    for (let index = this.defeatedBodies.length - 1; index >= 0; index -= 1) {
      const body = this.defeatedBodies[index];
      body.life -= dt;
      body.velocity.y -= 11 * dt;
      body.group.position.addScaledVector(body.velocity, dt);
      body.group.rotation.z += body.spin * dt;
      body.group.scale.multiplyScalar(Math.pow(0.12, dt));
      if (body.life <= 0) {
        disposeObject(body.group);
        this.defeatedBodies.splice(index, 1);
      }
    }
  }

  private updateCamera(dt: number) {
    if (!this.camera3d) return;
    const desired = this.playerPosition.clone().add(new THREE.Vector3(0, 17.5, 19));
    if (this.cameraShake > 0.01) {
      desired.x += (Math.random() - 0.5) * this.cameraShake;
      desired.y += (Math.random() - 0.5) * this.cameraShake * 0.45;
      desired.z += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake *= Math.pow(0.02, dt);
    }
    this.camera3d.position.lerp(desired, 1 - Math.pow(0.0003, dt));
    this.camera3d.lookAt(this.playerPosition.x, 0.6, this.playerPosition.z - 2.2);
  }

  private updateHud() {
    if (!this.statLine || !this.conditionLine || !this.comboLine) return;
    const definition = instrumentById.get(this.instrumentId)!;
    const materialCount = this.runMaterials[definition.materialId] ?? 0;
    const bossLock = this.enemies.some((enemy) => enemy.boss) ? '　<span style="color:#fb7185">BOSS LOCK</span>' : '';
    this.statLine.innerHTML = `<div style="font-size:23px;color:#fde047">敵水準 ${this.threat} / 解放上限 ${this.maxUnlockedThreat}${bossLock}</div><div style="margin-top:5px;font-size:16px">${definition.name}【${this.getEvolutionStage()}】　撃破 ${this.kills}　コイン ${this.runCoins}　素材 ${materialCount}</div>`;
    const ratio = Math.max(0, this.condition / this.maxCondition);
    const barColor = ratio > 0.5 ? '#22c55e' : ratio > 0.25 ? '#f59e0b' : '#ef4444';
    this.conditionLine.innerHTML = `<div style="height:16px;background:#450a0a;border:2px solid #e2e8f0;border-radius:8px;overflow:hidden"><div style="width:${ratio * 100}%;height:100%;background:${barColor}"></div></div><div style="font-size:13px;text-align:center;margin-top:-17px">CONDITION ${Math.ceil(this.condition)} / ${this.maxCondition}</div>`;
    const activeBuffs = [this.runTime < this.powerUntil ? `POWER ${Math.ceil(this.powerUntil - this.runTime)}s` : '', this.runTime < this.tempoUntil ? `TEMPO ${Math.ceil(this.tempoUntil - this.runTime)}s` : ''].filter(Boolean);
    this.comboLine.innerHTML = `${this.combo > 1 && this.runTime <= this.comboUntil ? `${this.combo} K.O. CHAIN<br>` : ''}<span style="font-size:15px;color:#bae6fd">${activeBuffs.join(' / ')}</span>`;
  }

  private showNotice(text: string, color: string) {
    if (!this.centerNotice) return;
    this.centerNotice.textContent = text;
    this.centerNotice.style.color = color;
    this.centerNotice.style.opacity = '1';
    window.setTimeout(() => {
      if (this.centerNotice) this.centerNotice.style.opacity = '0';
    }, 1600);
  }

  private showEvolution(text: string, color: string) {
    if (!this.evolutionLine) return;
    this.evolutionLine.textContent = text;
    this.evolutionLine.style.color = color;
    this.evolutionLine.style.opacity = '1';
    window.setTimeout(() => {
      if (this.evolutionLine) this.evolutionLine.style.opacity = '0';
    }, 1900);
  }

  private getEvolutionStage() {
    const level = this.progress.instruments[this.instrumentId].specialtyLevel;
    if (this.instrumentId === 'electric-guitar') {
      if (level >= 5) return '三重爆音';
      if (level >= 3) return '貫通増幅';
      if (level >= 1) return '音圧解放';
      return '直接打撃';
    }
    if (this.instrumentId === 'drum-sticks') return level >= 4 ? '乱打旋風' : level >= 2 ? '回転連打' : 'ツインヒット';
    if (this.instrumentId === 'bass') return level >= 4 ? '地鳴り重低音' : level >= 2 ? '低音衝撃' : '重量打撃';
    return level >= 4 ? '全鍵展開' : level >= 2 ? '和音掃射' : '音符射出';
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
      durationMs: Math.round(this.runTime * 1000),
    });
  }

  private cleanup() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    window.removeEventListener('resize', this.resizeHandler);
    this.threeRenderer?.domElement.removeEventListener('pointerdown', this.pointerHandler);
    this.uiRoot?.remove();
    this.scene3d?.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      if (Array.isArray(object.material)) object.material.forEach((entry) => entry.dispose());
      else object.material.dispose();
    });
    this.threeRenderer?.dispose();
    this.threeRenderer?.domElement.remove();
    this.threeRenderer = undefined;
    this.scene3d = undefined;
    this.camera3d = undefined;
  }
}

function instrumentDefinitionsAt(index: number): InstrumentId {
  return (['electric-guitar', 'bass', 'drum-sticks', 'keyboard'] as InstrumentId[])[THREE.MathUtils.clamp(index, 0, 3)];
}
