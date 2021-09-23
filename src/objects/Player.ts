import Position from "./Position";
import GameObject from "./GameObject";
import { Keyboard } from "../core/Keyboard";
import { Startable } from "../interfaces/Startable";
import { EventEmitter } from "../events/EventEmitter";
import { PlayerDTO } from "../core/dtos/PlayerDTO";

export default class Player extends GameObject implements Startable {
  private id = Number((Math.random() * 1000).toFixed(0));
  private position: Position = new Position(20, 20);
  private name = "Player" + (Math.random() * 1000).toFixed(0);
  private speed = 0.2;
  private image: ImageBitmap | null = null;

  constructor(private eventEmitter: EventEmitter) {
    super();
    console.log("Player created");
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

  public getId(): number {
    return this.id;
  }

  update(deltaTime: number) {
    this.updatePosition(deltaTime);
  }

  public toDto(): PlayerDTO {
    return {
      id: this.id,
      name: this.name,
      x: this.position.x,
      y: this.position.y,
    };
  }

  private updatePosition(deltaTime: number) {
    const [dx, dy] = this.getMoveDirection();

    if (dx == 0 && dy == 0) return;

    this.position.x += dx * this.speed * deltaTime;
    this.position.y += dy * this.speed * deltaTime;

    this.eventEmitter.emit("update-player", { player: this.toDto() });
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
