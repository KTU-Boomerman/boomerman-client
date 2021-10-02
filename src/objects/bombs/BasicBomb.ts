import SpriteFactory from "../../sprite/SpriteFactory";
import Item from "../Item";

export default class BasicBomb extends Item {
  constructor() {
    super(new SpriteFactory().createSprite("bomb"));
  }

  public explode(): void {
    throw new Error("Method not implemented.");
  }
}
