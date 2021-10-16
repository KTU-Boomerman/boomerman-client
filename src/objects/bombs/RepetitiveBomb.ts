import SpriteFactory from "../../sprite/SpriteFactory";
import Item from "../Item";
import Position from "../Position";

export default class ReperitiveBomb extends Item {
  constructor(position: Position) {
    super(new SpriteFactory().createSprite("bomb"), position);
  }

  public explode(): void {
    throw new Error("Method not implemented.");
  }
}
