import Renderable from "../interfaces/Renderable";

export class Renderer {
  private context: CanvasRenderingContext2D;
  private renderables: Set<Renderable> = new Set();
  private _grayscale: number = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d")!;
  }

  add(renderable: Renderable) {
    this.renderables.add(renderable);
  }

  remove(renderable: Renderable) {
    this.renderables.delete(renderable);
  }

  removeAll() {
    this.renderables.clear();
  }

  render() {
    this.clear();

    this.context.filter = `grayscale(${this.grayscale}%)`;

    for (const renderable of Array.from(this.renderables).sort(
      (a, b) => a.RENDER_PRIORITY - b.RENDER_PRIORITY
    )) {
      renderable.render(this.context);
    }
  }

  private clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  get grayscale() {
    return this._grayscale;
  }

  set grayscale(value: number) {
    this._grayscale = value;

    if (this._grayscale > 100) {
      this._grayscale = 100;
    }

    if (this._grayscale < 0) {
      this._grayscale = 0;
    }

    this.render();
  }
}
