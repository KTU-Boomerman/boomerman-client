import Position from "./Position";
import GameObject from "./GameObject";
import Sprite from "../sprite/Sprite";
import { PlayerDTO } from "../dtos/PlayerDTO";

export default class Enemy extends GameObject {
  private _id: string = "";
  private _position: Position;

  constructor(sprite: Sprite, playerDto: PlayerDTO) {
    super(sprite);
    this._id = playerDto.id;
    this._position = new Position(playerDto.position);
  }

  get id() {
    return this._id;
  }

  set position(position: Position) {
    this._position = position;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    this.sprite.draw(context, this._position);
  }
}
