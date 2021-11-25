import { singleton, inject } from 'tsyringe';
import { Effect } from '../../effects/Effect';
import { GrayscaleDecorator } from '../../effects/GrayscaleDecorator';
import { NullEffect } from '../../effects/NullEffect';
import { ShakeDecorator } from '../../effects/ShakeDecorator';
import { SoundEffect } from '../../effects/SoundEffect';
import { Renderer } from '../Renderer';
import { Sounds } from './SoundManager';

@singleton()
export class EffectManager {
  constructor(
    @inject('GameRenderer') private gameRenderer: Renderer,
    @inject('BackgroundRenderer') private backgroundRenderer: Renderer,
  ) {}

  public createEffect({
    sound,
    visual,
    animation,
  }: {
    sound?: Sounds;
    visual?: 'grayscale';
    animation?: 'shake';
  }): Effect {
    let effect = sound ? new SoundEffect(sound) : new NullEffect();

    if (visual === 'grayscale') {
      effect = new GrayscaleDecorator(effect, [this.gameRenderer, this.backgroundRenderer]);
    }

    if (animation === 'shake') effect = new ShakeDecorator(effect);

    return effect;
  }
}
