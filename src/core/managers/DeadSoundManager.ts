import { inject, singleton } from 'tsyringe';
import { ISoundManager, Sounds } from './ISoundManager';
import { SoundManager } from './SoundManager';

@singleton()
export class DeadSoundManager implements ISoundManager {
  private soundManager: ISoundManager;
  constructor(@inject(SoundManager) soundManager: ISoundManager) {
    this.soundManager = soundManager;
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
