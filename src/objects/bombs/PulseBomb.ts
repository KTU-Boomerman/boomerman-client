import Position from "../Position";
import Sprite from "../../sprite/Sprite";
import Bomb from "./Bomb";

export default class PulseBomb extends Bomb {
  constructor(sprite: Sprite, position: Position) {
    super(sprite, position);
  }

  public explode(): void {
    throw new Error("Method not implemented.");
  }
}
