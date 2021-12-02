import { singleton, inject } from 'tsyringe';
import { Effect } from '../../effects/Effect';
import { GrayscaleDecorator } from '../../effects/GrayscaleDecorator';
import { NullEffect } from '../../effects/NullEffect';
import { ShakeDecorator } from '../../effects/ShakeDecorator';
import { SoundEffect } from '../../effects/SoundEffect';
import { Renderer } from '../Renderer';
import { AudioManager } from './AudioManager';
import { Sounds } from './ISoundManager';

type EffectOptions = {
  sound?: Sounds;
  visual?: ['grayscale', number];
  animation?: 'shake';
};

@singleton()
export class EffectManager {
  constructor(
    @inject('GameRenderer') private gameRenderer: Renderer,
    @inject('BackgroundRenderer') private backgroundRenderer: Renderer,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}

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
