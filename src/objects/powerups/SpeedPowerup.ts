import SpriteFactory from "../../sprite/SpriteFactory";
import Item from "../Item";

export default class SpeedPowerup extends Item {
  constructor() {
    super(new SpriteFactory().createSprite("bomb"));
  }
}
