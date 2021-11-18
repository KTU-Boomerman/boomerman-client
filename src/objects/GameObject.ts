import Renderable from '../interfaces/Renderable';
import { Startable } from '../interfaces/Startable';
import Updatable from '../interfaces/Updatable';

export default class GameObject implements Renderable, Updatable, Startable {
  RENDER_PRIORITY = 0;

  public start(): void | Promise<void> {
    // Do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(_context: CanvasRenderingContext2D): void {
    // Do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    // Do nothing
  }
}
