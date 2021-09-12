import Position from "./Position";
import GameObject from "./GameObject";
import { Keyboard } from "../events/Keyboard";

export default class Player extends GameObject {
  private position: Position = new Position(20, 20);
  private speed = 0.2;

  constructor(position: Position) {
    super();
    this.position = position;
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#00FF00";
    context.fillRect(this.position.getX(), this.position.getY(), 20, 20);
  }

  update(deltaTime: number) {
    const [dx, dy] = this.getMoveDirection();
    this.position.addX(dx * this.speed * deltaTime);
    this.position.addY(dy * this.speed * deltaTime);
  }

  private getMoveDirection(): [number, number] {
    const keyboard = Keyboard.getInstance();
    let x = 0;
    let y = 0;

    if (keyboard.isPressed("KeyW")) y--;
    if (keyboard.isPressed("KeyS")) y++;
    if (keyboard.isPressed("KeyD")) x++;
    if (keyboard.isPressed("KeyA")) x--;

    console.log(x, y);

    return [x, y];
  }
}
