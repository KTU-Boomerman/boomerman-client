import Sprite from "../../sprite/Sprite";
import GameObject from "../GameObject";
import Position from "../Position";

export default class Wall extends GameObject {
  private isDestructible: boolean;
  private position: Position;

  constructor(sprite: Sprite, isDestructible: boolean, position: Position) {
    super(sprite);
    this.isDestructible = isDestructible;
    this.position = position;
  }

  render(context: CanvasRenderingContext2D): void {
    this._sprite.draw(context, this.position);
  }
}
