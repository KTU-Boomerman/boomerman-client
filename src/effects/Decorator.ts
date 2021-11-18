import { Effect } from './Effect';

export class Decorator implements Effect {
  protected component: Effect;

  constructor(component: Effect) {
    this.component = component;
  }

  public play() {
    this.component.play();
  }
}
