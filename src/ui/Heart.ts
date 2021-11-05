import Renderable from "../interfaces/Renderable";
import Position from "../objects/Position";
import Sprite from "../sprite/Sprite";

export class Heart implements Renderable {
  RENDER_PRIORITY: number = 100;
  
  constructor(private _position: Position, private _sprite: Sprite) {}

  set sprite(sprite: Sprite) {
    this._sprite = sprite;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    this._sprite.draw(context, this._position);
  }
}
