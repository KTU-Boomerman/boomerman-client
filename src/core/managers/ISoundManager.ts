export const soundFiles = {
  death: '../../../assets/sounds/death.mp3',
} as const;

export type Sounds = keyof typeof soundFiles;

export const sounds = Object.keys(soundFiles) as Sounds[];

export interface ISoundManager {
  init(): void;
  playSound(sound: Sounds): void;
  setVolume(volume: number): void;
}
