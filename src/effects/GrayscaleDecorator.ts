import { Decorator } from "./Decorator";
import { Effect } from "./Effect";
import { Renderer } from "../core/Renderer";

export class GrayscaleDecorator extends Decorator {
  constructor(component: Effect, private renderers: Renderer[]) {
    super(component);
  }

  public play() {
    super.play();

    this.renderers.forEach(renderer => {
      renderer.grayscale = 100;
    });
  }
}
