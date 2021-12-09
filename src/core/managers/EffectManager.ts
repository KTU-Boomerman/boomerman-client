import { singleton, inject } from 'tsyringe';
import { AliveEffect } from '../../effects/AliveEffect';
import { InjuredEffect } from '../../effects/InjuredEffect';
import { HeavyInjuredEffect } from '../../effects/HeavyInjuredEffect';
import { DeathEffect } from '../../effects/DeathEffect';
import { Effect } from '../../effects/Effect';
import { GrayscaleDecorator } from '../../effects/GrayscaleDecorator';
import { NullEffect } from '../../effects/NullEffect';
import { ShakeDecorator } from '../../effects/ShakeDecorator';
import { SoundEffect } from '../../effects/SoundEffect';
import { Renderer } from '../Renderer';
import { AudioManager } from './AudioManager';
import { Sounds } from './ISoundManager';
import { Lives } from './UIManager';
import { IManager } from '../../interfaces/IManager';
import { IVisitor } from '../../interfaces/IVisitor';

type EffectOptions = {
  sound?: Sounds;
  visual?: ['grayscale', number];
  animation?: 'shake';
};

@singleton()
export class EffectManager implements IManager {
  private _effectsCount = 0;

  private _aliveEffect: Effect;
  private _injuredEffect: Effect;
  private _heavyInjuredEffect: Effect;
  private _deathEffect: Effect;

  private _currentEffect: Effect;

  constructor(
    @inject('GameRenderer') private gameRenderer: Renderer,
    @inject('BackgroundRenderer') private backgroundRenderer: Renderer,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {
    this._aliveEffect = new AliveEffect(this);
    this._injuredEffect = new InjuredEffect(this);
    this._heavyInjuredEffect = new HeavyInjuredEffect(this);
    this._deathEffect = new DeathEffect(this);

    this._currentEffect = this._aliveEffect;
  }

  public accept(v: IVisitor) {
    return v.visitEffectManager(this);
  }

  public getEffectsCount() {
    return this._effectsCount;
  }

  public getCurrentEffect(): Effect {
    return this._currentEffect;
  }

  public changeEffect(lives: Lives) {
    const effects = {
      3: this._aliveEffect,
      2: this._injuredEffect,
      1: this._heavyInjuredEffect,
      0: this._deathEffect,
    };

    const newEffect = effects[lives];

    if (this._currentEffect !== newEffect) {
      this._currentEffect.stop();
      this._currentEffect = newEffect;
      this._currentEffect.play();
      this._effectsCount++;
    }
  }

  public createEffect({ sound, visual, animation }: EffectOptions = {}): Effect {
    let effect = sound ? new SoundEffect(sound, this.audioManager.getSoundManager()) : new NullEffect();

    if (visual?.[0] === 'grayscale') {
      const decoratedEffect = new GrayscaleDecorator(effect, [this.gameRenderer, this.backgroundRenderer]);
      decoratedEffect.grayscale = visual[1];
      effect = decoratedEffect;
    }

    if (animation === 'shake') effect = new ShakeDecorator(effect);

    return effect;
  }
}
