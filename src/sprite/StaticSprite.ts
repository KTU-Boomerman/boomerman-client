import Position from "../objects/Position";
import Sprite from "./Sprite";

export default class StaticSprite implements Sprite {
  private _image: ImageBitmap;

  constructor(image: ImageBitmap) {
    this._image = image;
  }

  draw(context: CanvasRenderingContext2D, position: Position): void {
    context.drawImage(this._image, position.x, position.y);
  }
}
