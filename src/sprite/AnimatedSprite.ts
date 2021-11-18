import Position from '../objects/Position';
import Sprite from './Sprite';

interface AnimatedSpriteOptions {
  isAnimated: true;
  numColumns: number;
  numRows: number;
  frameWidth: number;
  frameHeight: number;
  frameDuration: number;
  playsOnce: boolean;
}

export default class AnimatedSprite implements Sprite {
  private _image: ImageBitmap;
  private _options: AnimatedSpriteOptions;

  private _frameCount: number;
  private _time = 0;
  private _currentFrame = 0;
  private _isFinished = false;
  private _lastFrameDrawn = false;

  constructor(image: ImageBitmap, options: AnimatedSpriteOptions) {
    this._image = image;
    this._options = options;

    this._frameCount = options.numColumns * options.numRows;
  }

  get isFinished() {
    return this._isFinished;
  }

  clone(): AnimatedSprite {
    return new AnimatedSprite(this._image, this._options);
  }

  update(deltaTime: number): void {
    this._time += deltaTime;

    if (this._time > this._options.frameDuration) {
      this._time = 0;
      this._currentFrame = (this._currentFrame + 1) % this._frameCount;
    }

    const { numColumns, numRows } = this._options;
    if (this._currentFrame === numColumns * numRows - 1) {
      this._lastFrameDrawn = true;
    }

    if (this._lastFrameDrawn && this._options.playsOnce && this._currentFrame === 0) {
      this._isFinished = true;
    }
  }

  draw(context: CanvasRenderingContext2D, position: Position): void {
    if (this._isFinished) {
      return;
    }

    const { numColumns, frameWidth, frameHeight } = this._options;

    const row = Math.floor(this._currentFrame / numColumns);
    const column = this._currentFrame % numColumns;

    const sx = column * frameWidth;
    const sy = row * frameHeight;

    context.drawImage(this._image, sx, sy, frameWidth, frameHeight, position.x, position.y, frameWidth, frameHeight);
  }
}
