import { inject, singleton } from 'tsyringe';
import { DeadSoundManager } from './DeadSoundManager';
import { ISoundManager, Sounds } from './ISoundManager';
import { SoundManager } from './SoundManager';

type SoundManagerType = 'default' | 'dead';

@singleton()
export class AudioManager implements ISoundManager {
  private currentSoundManager: ISoundManager;

  constructor(
    @inject(SoundManager) private soundManager: ISoundManager,
    @inject(DeadSoundManager) private deadSoundManager: ISoundManager,
  ) {
    this.currentSoundManager = this.soundManager;
  }

  async init() {
    await this.soundManager.init();
    await this.deadSoundManager.init();
  }

  playSound(sound: Sounds): void {
    this.currentSoundManager.playSound(sound);
  }

  setVolume(volume: number): void {
    this.currentSoundManager.setVolume(volume);
  }

  public setSoundManager(soundManagerType: SoundManagerType): void {
    let newSoundManager: ISoundManager | null = null;

    if (soundManagerType === 'dead') newSoundManager = this.deadSoundManager;
    if (soundManagerType === 'default') newSoundManager = this.soundManager;

    if (newSoundManager != null && newSoundManager !== this.currentSoundManager) {
      this.currentSoundManager = newSoundManager;
    }
  }

  public getSoundManager(): ISoundManager {
    return this.currentSoundManager;
  }
}
