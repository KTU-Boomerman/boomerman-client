import Renderable from "../interfaces/Renderable";

export default class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;

    this.canvas = canvas;
    this.context = context;
  }

  reset() {
    this.clear();
  }

  render(renderable: Renderable) {
    renderable.render(this.context);
  }

  private clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
