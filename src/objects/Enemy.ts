import Position from "./Position";
import GameObject from "./GameObject";
import { Startable } from "../interfaces/Startable";
import { UpdatePlayerDTO } from "../dtos/UpdatePlayerDTO";
import Sprite from "../sprite/Sprite";

export default class Enemy extends GameObject implements Startable {
  private _id: number = Number((Math.random() * 1000).toFixed(0));
  private _position: Position = new Position(20, 20);
  private _name = "Player" + (Math.random() * 1000).toFixed(0);

  constructor(sprite: Sprite, playerDto: UpdatePlayerDTO) {
    super(sprite);
    this._id = playerDto.id;
    this._name = playerDto.name;
    this._position.x = playerDto.x;
    this._position.y = playerDto.y;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  render(context: CanvasRenderingContext2D): void {
    this.sprite.draw(context, this._position);
  }

  public toDto(): UpdatePlayerDTO {
    return {
      id: -1,
      name: this._name,
      x: this._position.x,
      y: this._position.y,
    };
  }
}
