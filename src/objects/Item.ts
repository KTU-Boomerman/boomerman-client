import Sprite from '../sprite/Sprite';
import GameObject from './GameObject';
import Position from './Position';

export default class Item extends GameObject {
  constructor(private sprite: Sprite, protected _position: Position) {
    super();
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    this.sprite.draw(context, this._position);
  }

  get position(): Position {
    return this._position;
  }
}
