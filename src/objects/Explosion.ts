import Sprite from "../sprite/Sprite";
import GameObject from "./GameObject";
import Position from "./Position";

export class Explosion extends GameObject {
  RENDER_PRIORITY = 10;

  constructor(sprite: Sprite, protected position: Position) {
    super(sprite);
  }

  render(context: CanvasRenderingContext2D): void {
    if (this.position == null) return;
    this.sprite.draw(context, this.position);
  }
}
