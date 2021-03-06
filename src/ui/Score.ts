import GameObject from '../objects/GameObject';
import Position from '../objects/Position';

export class Score extends GameObject {
  RENDER_PRIORITY = 100;

  private _position = Position.create(544 / 2, 26);
  private _score = 0;

  get score(): number {
    return this._score;
  }

  set score(value: number) {
    this._score = value;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    const text = `Score: ${this._score}`;
    const { width } = context.measureText(text);

    context.font = "16px 'Press Start 2P'";
    context.fillStyle = 'white';

    context.fillText(`Score: ${this._score}`, this._position.x - width / 2, this._position.y);
  }
}
