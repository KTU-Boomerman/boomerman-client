import Item from "../Item";
import Position from "../Position";

export default abstract class Bomb extends Item {
  RENDER_PRIORITY = 1;

  public explode(): void {
    throw new Error("Method not implemented.");
  }

  public setPosition(position: Position) : void {
    this.position = position;
  }
}
