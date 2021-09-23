import Renderable from "../interfaces/Renderable";
import { Startable } from "../interfaces/Startable";
import Updatable from "../interfaces/Updatable";

export default abstract class GameObject
  implements Renderable, Updatable, Startable
{
  public abstract start(): void | Promise<void>;
  public render(_context: CanvasRenderingContext2D): void {}
  public update(_deltaTime: number): void {}
}
