import Renderable from "../interfaces/Renderable";

export default class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private originalWidth: number;
  private originalHeight: number;

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;

    this.canvas = canvas;
    this.context = context;

    this.originalWidth = canvas.width;
    this.originalHeight = canvas.height;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(objects: Renderable[]) {
    this.clear();
    this.scale();

    objects.forEach((object) => {
      object.render(this.context);
    });
  }

  private scale() {
    const dimensions = this.getObjectFitSize(
      true,
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      this.canvas.width,
      this.canvas.height
    );

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = dimensions.width * dpr;
    this.canvas.height = dimensions.height * dpr;

    const ratio = Math.min(
      this.canvas.clientWidth / this.originalWidth,
      this.canvas.clientHeight / this.originalHeight
    );

    this.context.scale(ratio * dpr, ratio * dpr);
  }

  private getObjectFitSize(
    contains: boolean /* true = contain, false = cover */,
    containerWidth: number,
    containerHeight: number,
    width: number,
    height: number
  ) {
    const doRatio = width / height;
    const cRatio = containerWidth / containerHeight;
    let targetWidth = 0;
    let targetHeight = 0;
    const test = contains ? doRatio > cRatio : doRatio < cRatio;

    if (test) {
      targetWidth = containerWidth;
      targetHeight = targetWidth / doRatio;
    } else {
      targetHeight = containerHeight;
      targetWidth = targetHeight * doRatio;
    }

    return {
      width: targetWidth,
      height: targetHeight,
      x: (containerWidth - targetWidth) / 2,
      y: (containerHeight - targetHeight) / 2,
    };
  }
}
