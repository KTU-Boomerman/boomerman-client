import { singleton } from "tsyringe";
import {ISoundManager, soundFiles, sounds, Sounds} from "./ISoundManager";

@singleton()
export class SoundManager implements ISoundManager {
  public static readonly DEFAULT_VALUE = 0.05;

  private audioContext: AudioContext;
  private audioBuffers: Map<Sounds, AudioBuffer> = new Map();
  private gainNode: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.createGainNode();
  }

  private createGainNode() {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = SoundManager.DEFAULT_VALUE;
    return gainNode;
  }

  public async init() {
    for (const sound of sounds) {
      const url = soundFiles[sound];
      this.loadSound(sound as Sounds, url);
    }
  }

  public setVolume(volume: number) {
    this.gainNode.gain.value = volume;
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