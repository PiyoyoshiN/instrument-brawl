type InstrumentId = 'electric-guitar' | 'bass' | 'drum-sticks' | 'keyboard';

type SurvivalProgressSnapshot = {
  selectedInstrument?: InstrumentId;
};

const survivalProgressStorageKey = 'instrument-brawl:survival-progress';
const guitarBattleBgmPath = 'assets/audio/bgm/bgm_guitar_battle_combo_breaker_blitz.wav';

// Intro: 0:00 -> loopEnd. After the first pass, repeat loopStart -> loopEnd.
// These values are intentionally kept together so they can be tuned later
// without changing the playback controller.
const guitarBattleLoopStartSeconds = 19.96;
const guitarBattleLoopEndSeconds = 59.54;
const guitarBattleBgmVolume = 0.34;
const battleDetectionIntervalMs = 200;

function readSelectedInstrument(): InstrumentId | undefined {
  try {
    const raw = window.localStorage.getItem(survivalProgressStorageKey);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as SurvivalProgressSnapshot;
    return parsed.selectedInstrument;
  } catch {
    return undefined;
  }
}

function isSurvivalBattleVisible() {
  const gameRoot = document.getElementById('game');
  if (!gameRoot) return false;

  // The current survival battle creates a dedicated Three.js canvas above the
  // Phaser canvas. Other screens do not create this z-index 20 canvas.
  return Array.from(gameRoot.querySelectorAll('canvas')).some(
    (canvas) => canvas.style.zIndex === '20' && canvas.style.position === 'absolute',
  );
}

class GuitarBattleBgmController {
  private audioContext?: AudioContext;
  private audioBuffer?: AudioBuffer;
  private loadingPromise?: Promise<AudioBuffer | undefined>;
  private activeSource?: AudioBufferSourceNode;
  private activeGain?: GainNode;
  private shouldBePlaying = false;
  private interactionUnlocked = false;

  start() {
    const unlock = () => {
      this.interactionUnlocked = true;
      void this.ensureContextReady();
      void this.ensureBufferLoaded();
      this.syncPlaybackState();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    window.setInterval(() => this.syncPlaybackState(), battleDetectionIntervalMs);
    this.syncPlaybackState();
  }

  private syncPlaybackState() {
    const guitarBattleActive =
      isSurvivalBattleVisible() && readSelectedInstrument() === 'electric-guitar';

    if (guitarBattleActive === this.shouldBePlaying) return;
    this.shouldBePlaying = guitarBattleActive;

    if (guitarBattleActive) {
      void this.playWhenReady();
    } else {
      this.stopWithFade();
    }
  }

  private async ensureContextReady() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    return this.audioContext;
  }

  private ensureBufferLoaded() {
    if (this.audioBuffer) return Promise.resolve(this.audioBuffer);
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      try {
        const context = await this.ensureContextReady();
        const url = new URL(guitarBattleBgmPath, document.baseURI).toString();
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`BGM load failed: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await context.decodeAudioData(arrayBuffer);
        return this.audioBuffer;
      } catch (error) {
        console.warn(
          `[Sound Braver] Guitar battle BGM could not be loaded from ${guitarBattleBgmPath}.`,
          error,
        );
        return undefined;
      } finally {
        this.loadingPromise = undefined;
      }
    })();

    return this.loadingPromise;
  }

  private async playWhenReady() {
    if (!this.interactionUnlocked || document.hidden) return;

    const context = await this.ensureContextReady();
    const buffer = await this.ensureBufferLoaded();
    if (!buffer || !this.shouldBePlaying || document.hidden || this.activeSource) return;

    const source = context.createBufferSource();
    const gain = context.createGain();
    const now = context.currentTime;
    const safeLoopStart = Math.max(0, Math.min(guitarBattleLoopStartSeconds, buffer.duration));
    const safeLoopEnd = Math.max(safeLoopStart + 0.05, Math.min(guitarBattleLoopEndSeconds, buffer.duration));

    source.buffer = buffer;
    source.loop = true;
    source.loopStart = safeLoopStart;
    source.loopEnd = safeLoopEnd;
    source.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(guitarBattleBgmVolume, now + 0.35);

    source.addEventListener('ended', () => {
      if (this.activeSource === source) {
        this.activeSource = undefined;
        this.activeGain = undefined;
      }
    });

    this.activeSource = source;
    this.activeGain = gain;
    source.start(0, 0);
  }

  private stopWithFade() {
    const context = this.audioContext;
    const source = this.activeSource;
    const gain = this.activeGain;
    this.activeSource = undefined;
    this.activeGain = undefined;

    if (!context || !source || !gain) return;

    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    window.setTimeout(() => {
      try {
        source.stop();
      } catch {
        // The source may already have ended while the scene was changing.
      }
      source.disconnect();
      gain.disconnect();
    }, 230);
  }

  private handleVisibilityChange() {
    if (!this.audioContext) return;

    if (document.hidden) {
      void this.audioContext.suspend();
      return;
    }

    if (this.interactionUnlocked) {
      void this.audioContext.resume().then(() => {
        if (this.shouldBePlaying && !this.activeSource) void this.playWhenReady();
      });
    }
  }
}

new GuitarBattleBgmController().start();

export {};
