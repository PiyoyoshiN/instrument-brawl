type InstrumentId = 'electric-guitar' | 'bass' | 'drum-sticks' | 'keyboard';

type SurvivalProgressSnapshot = {
  selectedInstrument?: InstrumentId;
};

type BattleBgmDefinition = {
  path: string;
  loopStartSeconds: number;
  loopEndSeconds: number;
  volume: number;
};

const survivalProgressStorageKey = 'instrument-brawl:survival-progress';
const battleDetectionIntervalMs = 200;

// Each track starts at 0:00 on the first play. When loopEnd is reached,
// Web Audio jumps directly to loopStart with no crossfade.
const battleBgmByInstrument: Partial<Record<InstrumentId, BattleBgmDefinition>> = {
  'electric-guitar': {
    path: 'assets/audio/bgm/bgm_guitar_battle_combo_breaker_blitz.wav',
    loopStartSeconds: 19.96,
    loopEndSeconds: 59.54,
    volume: 0.34,
  },
  bass: {
    path: 'assets/audio/bgm/bgm_bass_battle_adopted.wav',
    loopStartSeconds: 26.997770833333334,
    loopEndSeconds: 77.52458333333334,
    volume: 0.34,
  },
};

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

class BattleBgmController {
  private audioContext?: AudioContext;
  private readonly audioBuffers = new Map<InstrumentId, AudioBuffer>();
  private readonly loadingPromises = new Map<InstrumentId, Promise<AudioBuffer | undefined>>();
  private activeSource?: AudioBufferSourceNode;
  private activeGain?: GainNode;
  private activeInstrument?: InstrumentId;
  private desiredInstrument?: InstrumentId;
  private interactionUnlocked = false;

  start() {
    const unlock = () => {
      this.interactionUnlocked = true;
      void this.ensureContextReady();
      this.syncPlaybackState();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    window.setInterval(() => this.syncPlaybackState(), battleDetectionIntervalMs);
    this.syncPlaybackState();
  }

  private getTargetInstrument(): InstrumentId | undefined {
    if (!isSurvivalBattleVisible()) return undefined;
    const selectedInstrument = readSelectedInstrument();
    if (!selectedInstrument || !battleBgmByInstrument[selectedInstrument]) return undefined;
    return selectedInstrument;
  }

  private syncPlaybackState() {
    const nextInstrument = this.getTargetInstrument();

    if (nextInstrument !== this.desiredInstrument) {
      this.desiredInstrument = nextInstrument;
      if (this.activeSource) this.stopWithFade();
    }

    if (nextInstrument && !this.activeSource) {
      void this.playWhenReady(nextInstrument);
    } else if (!nextInstrument && this.activeSource) {
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

  private ensureBufferLoaded(instrumentId: InstrumentId) {
    const cached = this.audioBuffers.get(instrumentId);
    if (cached) return Promise.resolve(cached);

    const loading = this.loadingPromises.get(instrumentId);
    if (loading) return loading;

    const definition = battleBgmByInstrument[instrumentId];
    if (!definition) return Promise.resolve(undefined);

    const loadingPromise = (async () => {
      try {
        const context = await this.ensureContextReady();
        const url = new URL(definition.path, document.baseURI).toString();
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`BGM load failed: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const decoded = await context.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(instrumentId, decoded);
        return decoded;
      } catch (error) {
        console.warn(
          `[Sound Braver] Battle BGM could not be loaded from ${definition.path}.`,
          error,
        );
        return undefined;
      } finally {
        this.loadingPromises.delete(instrumentId);
      }
    })();

    this.loadingPromises.set(instrumentId, loadingPromise);
    return loadingPromise;
  }

  private async playWhenReady(instrumentId: InstrumentId) {
    if (!this.interactionUnlocked || document.hidden) return;

    const definition = battleBgmByInstrument[instrumentId];
    if (!definition) return;

    const context = await this.ensureContextReady();
    const buffer = await this.ensureBufferLoaded(instrumentId);
    if (
      !buffer
      || this.desiredInstrument !== instrumentId
      || document.hidden
      || this.activeSource
    ) return;

    const source = context.createBufferSource();
    const gain = context.createGain();
    const now = context.currentTime;
    const safeLoopStart = Math.max(0, Math.min(definition.loopStartSeconds, buffer.duration));
    const safeLoopEnd = Math.max(
      safeLoopStart + 0.05,
      Math.min(definition.loopEndSeconds, buffer.duration),
    );

    source.buffer = buffer;
    source.loop = true;
    source.loopStart = safeLoopStart;
    source.loopEnd = safeLoopEnd;
    source.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(definition.volume, now + 0.35);

    source.addEventListener('ended', () => {
      if (this.activeSource === source) {
        this.activeSource = undefined;
        this.activeGain = undefined;
        this.activeInstrument = undefined;
      }
    });

    this.activeSource = source;
    this.activeGain = gain;
    this.activeInstrument = instrumentId;
    source.start(0, 0);
  }

  private stopWithFade() {
    const context = this.audioContext;
    const source = this.activeSource;
    const gain = this.activeGain;
    this.activeSource = undefined;
    this.activeGain = undefined;
    this.activeInstrument = undefined;

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
      void this.audioContext.resume().then(() => this.syncPlaybackState());
    }
  }
}

new BattleBgmController().start();

export {};
