import Position from "../objects/Position";
import Sprite from "./Sprite";

export default class StaticSprite implements Sprite {
  private _image: ImageBitmap;

  constructor(image: ImageBitmap) {
    if (image == null) debugger;
    this._image = image;
  }

  draw(context: CanvasRenderingContext2D, position: Position): void {
    context.drawImage(
      this._image,
      Math.round(position.x),
      Math.round(position.y)
    );
  }
}
