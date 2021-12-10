import GameObject from '../objects/GameObject';
import Position from '../objects/Position';
import Sprite from '../sprite/Sprite';

export class Heart extends GameObject {
  RENDER_PRIORITY = 100;

  constructor(private _position: Position, private _sprite: Sprite) {
    super();
  }

  set sprite(sprite: Sprite) {
    this._sprite = sprite;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    this._sprite.draw(context, this._position);
  }
}
