const soundFiles = {
  death: "../../../assets/sounds/death.mp3",
} as const;

export type Sounds = keyof typeof soundFiles;

const sounds = Object.keys(soundFiles) as Sounds[];

class SoundManager {
  public static readonly SOUND_VOLUME = 0.05;

  private audioContext: AudioContext;
  private audioBuffers: Map<Sounds, AudioBuffer> = new Map();
  private gainNode: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.createGainNode();
  }

  private createGainNode() {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = SoundManager.SOUND_VOLUME;
    return gainNode;
  }

  public async init() {
    for (const sound of sounds) {
      const url = soundFiles[sound];
      this.loadSound(sound as Sounds, url);
    }
  }

  private async loadSound(sound: Sounds, url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.audioBuffers.set(sound, audioBuffer);
  }

  public playSound(sound: Sounds) {
    const audioBuffer = this.audioBuffers.get(sound);
    if (!audioBuffer) {
      throw new Error(`Sound ${sound} not found`);
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    source.connect(this.gainNode);
    source.start();
  }
}

export const soundManager = new SoundManager();
