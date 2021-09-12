import Renderable from "../interfaces/Renderable";
import Updatable from "../interfaces/Updatable";

export default abstract class GameObject implements Renderable, Updatable {
  public abstract render(context: CanvasRenderingContext2D): void;
  public update(_deltaTime: number): void {}
}
