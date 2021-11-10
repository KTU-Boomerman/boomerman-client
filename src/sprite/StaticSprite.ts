import Position from "../objects/Position";
import Sprite from "./Sprite";

export default class StaticSprite implements Sprite {
  private _image: ImageBitmap;

  constructor(image: ImageBitmap) {
    this._image = image;
  }

  clone(): Sprite {
    return new StaticSprite(this._image);
  }
  
  update(_deltaTime: number): void {}

  draw(context: CanvasRenderingContext2D, position: Position): void {
    context.drawImage(
      this._image,
      Math.round(position.x),
      Math.round(position.y)
    );
  }
}
