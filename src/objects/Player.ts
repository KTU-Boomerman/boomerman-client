import Position from "./Position";
import GameObject from "./GameObject";
import { Keyboard } from "../core/Keyboard";
import Server from "../core/Server";
import Sprite from "../sprite/Sprite";
import { DataTransferable } from "../dtos/DataTransferable";
import { PlayerDTO } from "../dtos/PlayerDTO";

export default class Player
  extends GameObject
  implements DataTransferable<PlayerDTO>
{
  private _id: string = "";
  private _position: Position;
  private _speed = 0.2;

  constructor(sprite: Sprite, id: string, position: Position) {
    super(sprite);
    this._id = id;
    this._position = position;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    this._sprite.draw(context, this._position);
  }

  get id() {
    return this._id;
  }

  set position(position: Position) {
    this._position = position;
  }

  update(deltaTime: number) {
    this.updatePosition(deltaTime);
  }

  toDTO() {
    return {
      id: this._id,
      position: this._position.toDTO(),
    };
  }

  private updatePosition(deltaTime: number) {
    const [dx, dy] = this.getMoveDirection();

    if (dx == 0 && dy == 0) return;
    if (this._position == null) return;

    this._position.x += dx * this._speed * deltaTime;
    this._position.y += dy * this._speed * deltaTime;

    Server.getInstance()
      .playerMove(this._position.toDTO())
      .then(({ isValid, position: originalPositon }) => {
        if (!isValid && originalPositon != null) {
          this._position = new Position(originalPositon);
        }
      })
      .catch(console.error);
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
