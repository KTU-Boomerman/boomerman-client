import Sprite from "../../sprite/Sprite";
import GameObject from "../GameObject";
import Position from "../Position";

export default class Wall extends GameObject {
  private _isDestructible: boolean;
  private _position: Position;

  constructor(private sprite: Sprite, isDestructible: boolean, position: Position) {
    super();
    this._isDestructible = isDestructible;
    this._position = position;
  }

  get isDestructible(): boolean {
    return this._isDestructible;
  }

  render(context: CanvasRenderingContext2D): void {
    this.sprite.draw(context, this._position);
  }

  get position(): Position {
    return this._position;
  }
}
