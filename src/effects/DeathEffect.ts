import { Effect } from './Effect';
import { EffectManager } from '../core/managers/EffectManager';

export class DeathEffect implements Effect {
  private _effect: Effect;

  constructor(effectManager: EffectManager) {
    this._effect = effectManager.createEffect({
      sound: 'death',
      visual: ['grayscale', 100],
      animation: 'shake',
    });
  }

  play(): void {
    this._effect.play();
  }
  stop(): void {
    this._effect.stop();
  }
}
