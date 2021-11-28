import Position from '../objects/Position';
import Sprite, { DrawOptions } from './Sprite';

export default class StaticSprite implements Sprite {
  private _image: ImageBitmap;

  constructor(image: ImageBitmap) {
    this._image = image;
  }

  clone(): Sprite {
    return new StaticSprite(this._image);
  }

  update(): void {
    // Do nothing
  }

  draw(context: CanvasRenderingContext2D, position: Position, { color, opacity }: DrawOptions = {}): void {
    if (color) {
      context.save();
      context.fillStyle = color;
      context.globalAlpha = opacity ?? 0.5;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      context.globalCompositeOperation = 'destination-atop';
      context.globalAlpha = 1;
      context.drawImage(this._image, Math.round(position.x), Math.round(position.y));
      context.restore();
    } else {
      context.drawImage(this._image, Math.round(position.x), Math.round(position.y));
    }
  }
}
