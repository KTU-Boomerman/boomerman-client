export default interface Renderable {
  readonly RENDER_PRIORITY: number;
  render(context: CanvasRenderingContext2D): void;
}
