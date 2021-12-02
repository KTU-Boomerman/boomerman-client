import Updatable from '../interfaces/Updatable';
import { PlayerColor } from '../objects/PlayerColor';
import Position from '../objects/Position';

export type DrawOptions = Partial<{
  color: PlayerColor | null;
  opacity: number;
}>;

export default interface Sprite extends Updatable {
  draw(context: CanvasRenderingContext2D, position: Position, options?: DrawOptions): void;
  clone(): Sprite;
}
