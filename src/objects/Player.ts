import Position from "./Position";
import GameObject from "./GameObject";
import { Keyboard } from "../core/Keyboard";
import { UpdatePlayerDTO } from "../dtos/UpdatePlayerDTO";
import Server from "../core/Server";
import Sprite from "../sprite/Sprite";

export default class Player extends GameObject {
  private _id = Number((Math.random() * 1000).toFixed(0));
  private _position: Position = new Position(20, 20);
  private _name = "Player" + (Math.random() * 1000).toFixed(0);
  private _speed = 0.2;

  constructor(sprite: Sprite) {
    super(sprite);
    console.log("Player created");
  }

  async load() {
    await this._sprite.load();
  }

  render(context: CanvasRenderingContext2D): void {
    this._sprite.draw(context, this._position);
  }

  get id(): number {
    return this._id;
  }

  update(deltaTime: number) {
    this.updatePosition(deltaTime);
  }

  toDto(): UpdatePlayerDTO {
    return {
      id: this._id,
      name: this._name,
      x: this._position.x,
      y: this._position.y,
    };
  }

  private updatePosition(deltaTime: number) {
    const [dx, dy] = this.getMoveDirection();

    if (dx == 0 && dy == 0) return;

    this._position.x += dx * this._speed * deltaTime;
    this._position.y += dy * this._speed * deltaTime;

    Server.getInstance().updatePlayer(this.toDto());
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
