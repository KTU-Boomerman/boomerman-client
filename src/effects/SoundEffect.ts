import { ISoundManager, Sounds } from '../core/managers/ISoundManager';
import { Effect } from './Effect';

export class SoundEffect implements Effect {
  private _sound: Sounds;
  private _soundManager: ISoundManager;

  constructor(sound: Sounds, soundManager: ISoundManager) {
    this._sound = sound;
    this._soundManager = soundManager;
  }

  play(): void {
    this._soundManager.playSound(this._sound);
  }
}
