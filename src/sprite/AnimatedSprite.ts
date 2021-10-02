import Position from "../objects/Position";
import Sprite from "./Sprite";

export default class AnimatedSprite implements Sprite {
  private _filePath: string;
  private _image: ImageBitmap | undefined;

  constructor(filePath: string) {
    this._filePath = filePath;
  }

  async load(): Promise<void> {
    const result = await fetch(this._filePath);
    const blob = await result.blob();
    this._image = await createImageBitmap(blob);
  }

  // TODO: add logic to draw with animation
  draw(context: CanvasRenderingContext2D, position: Position): void {
    if (!this._image) {
      throw new Error(`Sprite not loaded. File: ${this._filePath}`);
    }
    context.drawImage(this._image, position.x, position.y);
  }
}
