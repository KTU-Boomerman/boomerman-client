import AnimatedSprite from "../sprite/AnimatedSprite";
import GameObject from "./GameObject";
import Position from "./Position";

export class Explosion extends GameObject {
  RENDER_PRIORITY = 10;

  constructor(private sprite: AnimatedSprite, protected position: Position) {
    super();
  }

  update(deltaTime: number): void {
    this.sprite.update(deltaTime);
  }

  render(context: CanvasRenderingContext2D): void {
    if (this.position == null) return;
    this.sprite.draw(context, this.position);
  }

  get isFinished(): boolean {
    return this.sprite.isFinished;
  }
}
