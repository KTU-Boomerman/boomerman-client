import Renderable from "../interfaces/Renderable";
import { Startable } from "../interfaces/Startable";
import Updatable from "../interfaces/Updatable";

export default class GameObject implements Renderable, Updatable, Startable {
  RENDER_PRIORITY = 0;
  constructor() {}
  public start(): void | Promise<void> {}
  public render(_context: CanvasRenderingContext2D): void {}
  public update(_deltaTime: number): void {}
}
