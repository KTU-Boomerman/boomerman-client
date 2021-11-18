import Position from '../Position';
import Sprite from '../../sprite/Sprite';
import Bomb from './Bomb';

export default class WaveBomb extends Bomb {
  constructor(sprite: Sprite, position: Position) {
    super(sprite, position);
  }
}
