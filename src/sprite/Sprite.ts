import Updatable from '../interfaces/Updatable';
import Position from '../objects/Position';

export default interface Sprite extends Updatable {
  draw(context: CanvasRenderingContext2D, position: Position): void;
  clone(): Sprite;
}
