import { Decorator } from './Decorator';
import { Effect } from './Effect';

export class ShakeDecorator extends Decorator {
  constructor(component: Effect) {
    super(component);
  }

  public play() {
    super.play();
    document.getElementById('stage')?.classList.add('shake');
  }

  public stop() {
    super.stop();
    document.getElementById('stage')?.classList.remove('shake');
  }
}
