import Position from "./Position";
import GameObject from "./GameObject";
import Server from "../core/Server";
import Sprite from "../sprite/Sprite";
import { DataTransferable } from "../dtos/DataTransferable";
import { PlayerDTO } from "../dtos/PlayerDTO";
import { IKeyboardManager } from "../core/managers/IKeyboardManager";

export default class Player
  extends GameObject
  implements DataTransferable<PlayerDTO>
{
  RENDER_PRIORITY = 10;

  private _id: string = "";
  private _position: Position;
  private _speed = 0.2;
  private _keyboardManager?: IKeyboardManager;

  constructor(sprite: Sprite, position: Position) {
    super(sprite);
    this._position = position;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    this.sprite.draw(context, this._position);
  }

  set id(id: string) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set position(position: Position) {
    this._position = position;
  }

  get position() {
    return this._position;
  }

  set keyboardManager(keyboardManager: IKeyboardManager) {
    this._keyboardManager = keyboardManager;
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

    const newPosition = Position.create(this._position.x + dx * this._speed * deltaTime, this._position.y + dy * this._speed * deltaTime)

    Server.getInstance()
      // TODO: investigate why needs id or not
      .invoke("PlayerMove", this._position.toDTO(), newPosition.toDTO())
      .then(({ position : originalPosition}) => {
        if (originalPosition) {
          this._position = new Position(originalPosition);
        }
      })
      .catch(console.error);
  }

  private getMoveDirection(): [number, number] {
    let x = 0;
    let y = 0;

    if (this._keyboardManager?.isPressed("ArrowUp")) y--;
    if (this._keyboardManager?.isPressed("ArrowDown")) y++;
    if (this._keyboardManager?.isPressed("ArrowRight")) x++;
    if (this._keyboardManager?.isPressed("ArrowLeft")) x--;

    if (x != 0 && y != 0) {
      x *= Math.sqrt(0.5);
      y *= Math.sqrt(0.5);
    }

    return [x, y];
  }
}
