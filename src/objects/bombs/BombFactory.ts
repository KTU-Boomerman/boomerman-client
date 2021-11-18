import { inject, singleton } from 'tsyringe';
import Sprite from '../../sprite/Sprite';
import SpriteFactory from '../../sprite/SpriteFactory';
import Position from '../Position';
import { BombType } from '../../objects/BombType';
import BasicBomb from './BasicBomb';
import Bomb from './Bomb';
import BoomerangBomb from './BoomerangBomb';
import WaveBomb from './WaveBomb';
import PulseBomb from './PulseBomb';

@singleton()
export class BombFactory {
  regularSprite: Sprite;
  pulseSprite: Sprite;
  waveSprite: Sprite;
  boomerangSprite: Sprite;

  constructor(@inject(SpriteFactory) private spriteFactory: SpriteFactory) {
    this.regularSprite = this.spriteFactory.createSprite('regularBomb');
    this.pulseSprite = this.spriteFactory.createSprite('pulseBomb');
    this.waveSprite = this.spriteFactory.createSprite('waveBomb');
    this.boomerangSprite = this.spriteFactory.createSprite('boomerangBomb');
  }

  createBomb(position: Position, bombType: BombType): Bomb {
    switch (bombType) {
      case BombType.Pulse:
        return new PulseBomb(this.pulseSprite, position);
      case BombType.Wave:
        return new WaveBomb(this.waveSprite, position);
      case BombType.Boomerang:
        return new BoomerangBomb(this.boomerangSprite, position);
      default:
        return new BasicBomb(this.regularSprite, position);
    }
  }
}
