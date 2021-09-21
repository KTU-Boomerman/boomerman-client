import Position from "./Position";
import GameObject from "./GameObject";
import { Keyboard } from "../core/Keyboard";
import { Startable } from "../interfaces/Startable";

export default class Player extends GameObject implements Startable {
  private position: Position = new Position(20, 20);
  private speed = 0.2;
  private image: ImageBitmap | null = null;

  constructor(position: Position) {
    super();
    this.position = position;
  }

  async start() {
    const result = await fetch("../../assets/player.png");
    const blob = await result.blob();
    this.image = await createImageBitmap(blob);
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#00FF00";
    if (this.image) {
      context.drawImage(this.image, this.position.x, this.position.y);
    } else {
      context.fillRect(this.position.x, this.position.y, 32, 32);
    }
  }

  update(deltaTime: number) {
    const [dx, dy] = this.getMoveDirection();

    if (dx == 0 && dy == 0) return;

    this.position.x += dx * this.speed * deltaTime;
    this.position.y += dy * this.speed * deltaTime;
  }

  private getMoveDirection(): [number, number] {
    const keyboard = Keyboard.getInstance();
    let x = 0;
    let y = 0;

    if (keyboard.isPressed("KeyW")) y--;
    if (keyboard.isPressed("KeyS")) y++;
    if (keyboard.isPressed("KeyD")) x++;
    if (keyboard.isPressed("KeyA")) x--;

    if (x != 0 && y != 0) {
      x *= Math.sqrt(0.5);
      y *= Math.sqrt(0.5);
    }

    return [x, y];
  }
}
