import { singleton, inject } from 'tsyringe';
import { Effect } from '../../effects/Effect';
import { GrayscaleDecorator } from '../../effects/GrayscaleDecorator';
import { NullEffect } from '../../effects/NullEffect';
import { ShakeDecorator } from '../../effects/ShakeDecorator';
import { SoundEffect } from '../../effects/SoundEffect';
import { Renderer } from '../Renderer';
import { AudioManager } from './AudioManager';
import { EntityManager } from './EntityManager';
import { ISoundManager, Sounds } from './ISoundManager';

type EffectOptions = {
  sound?: Sounds;
  visual?: 'grayscale';
  animation?: 'shake';
};

@singleton()
export class EffectManager {
  constructor(
    @inject('GameRenderer') private gameRenderer: Renderer,
    @inject('BackgroundRenderer') private backgroundRenderer: Renderer,
    @inject(EntityManager) private entityManager: EntityManager,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}

  public createEffect(soundManger: ISoundManager, { sound, visual, animation }: EffectOptions): Effect {
    const player = this.entityManager.getPlayer();

    if (player && player.isDead()) this.audioManager.setSoundManager('dead');

    let effect = sound ? new SoundEffect(sound, soundManger) : new NullEffect();

    if (visual === 'grayscale') {
      effect = new GrayscaleDecorator(effect, [this.gameRenderer, this.backgroundRenderer]);
    }

    if (animation === 'shake') effect = new ShakeDecorator(effect);

    return effect;
  }
}
