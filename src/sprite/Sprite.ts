import Position from "../objects/Position";

export default interface Sprite {
  draw(context: CanvasRenderingContext2D, position: Position): void;
  load(): Promise<void>;
}
