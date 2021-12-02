import { Decorator } from './Decorator';
import { Effect } from './Effect';
import { Renderer } from '../core/Renderer';

export class GrayscaleDecorator extends Decorator {
  private _grayscale: number;

  constructor(component: Effect, private renderers: Renderer[]) {
    super(component);
    this._grayscale = 100;
  }

  set grayscale(grayscale: number) {
    this._grayscale = grayscale;
  }

  public play() {
    super.play();

    this.renderers.forEach((renderer) => {
      renderer.grayscale = this._grayscale;
    });
  }

  public stop() {
    super.stop();

    this.renderers.forEach((renderer) => {
      renderer.grayscale = 0;
    });
  }
}
