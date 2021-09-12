import Position from "./Position";
import GameObject from "./GameObject";

export default class Block extends GameObject {
  private position: Position = new Position(20, 20);

  constructor(position: Position) {
    super();
    this.position = position;
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#000000";
    context.fillRect(this.position.getX(), this.position.getY(), 20, 20);
  }

  update(deltaTime: number) {
    this.position.setX(this.position.getX() + 0.2 * deltaTime);
  }
}
