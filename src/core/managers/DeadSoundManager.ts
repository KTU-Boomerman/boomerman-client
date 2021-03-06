import { inject, singleton } from 'tsyringe';
import { ISoundManager, Sounds } from './ISoundManager';
import { SoundManager } from './SoundManager';

@singleton()
export class DeadSoundManager implements ISoundManager {
  constructor(@inject(SoundManager) private soundManager: ISoundManager) {
    this.soundManager.setVolume(0.01);
  }

  public setVolume(volume: number) {
    this.soundManager.setVolume(volume);
  }

  public async init() {
    this.soundManager.init();
  }

  public playSound(sound: Sounds) {
    this.soundManager.playSound(sound);
  }
}
