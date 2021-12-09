import { Effect } from './Effect';
import { EffectManager } from '../core/managers/EffectManager';

export class HeavyInjuredEffect implements Effect {
  private _effect: Effect;

  constructor(effectManager: EffectManager) {
    this._effect = effectManager.createEffect({
      visual: ['grayscale', 66],
    });
  }

  play(): void {
    this._effect.play();
  }
  stop(): void {
    this._effect.stop();
  }
}
