import Renderable from "../interfaces/Renderable";
import { Startable } from "../interfaces/Startable";
import Updatable from "../interfaces/Updatable";
import Sprite from "../sprite/Sprite";

export default class GameObject implements Renderable, Updatable, Startable {
  constructor(protected _sprite: Sprite) {}
  public start(): void | Promise<void> {}
  public render(_context: CanvasRenderingContext2D): void {}
  public update(_deltaTime: number): void {}
  public async load(): Promise<void> {}
}
