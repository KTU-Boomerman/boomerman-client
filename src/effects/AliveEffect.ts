import { Effect } from './Effect';
import { EffectManager } from '../core/managers/EffectManager';

export class AliveEffect implements Effect {
  private _effect: Effect;

  constructor(effectManager: EffectManager) {
    this._effect = effectManager.createEffect();
  }

  play(): void {
    this._effect.play();
  }
  stop(): void {
    this._effect.stop();
  }
}
