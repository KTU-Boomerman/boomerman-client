import Renderable from '../interfaces/Renderable';
import Position from '../objects/Position';

export class BombCount implements Renderable {
  RENDER_PRIORITY = 100;

  private _position = Position.create(112, 412);
  private _count = 0;

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    const text = `Bomb Count: ${this._count}`;
    const { width } = context.measureText(text);

    context.font = "16px 'Press Start 2P'";
    context.fillStyle = 'white';

    context.fillText(`Bomb Count: ${this._count}`, this._position.x - width / 2, this._position.y);
  }
}
