import { Effect } from './Effect';

export class NullEffect implements Effect {
  play(): void {
    // Do nothing
  }

  stop(): void {
    // Do nothing
  }
}
