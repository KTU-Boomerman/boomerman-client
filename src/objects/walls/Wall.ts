import Sprite from "../../sprite/Sprite";
import GameObject from "../GameObject";

export default class Wall extends GameObject {
  isDestructible: boolean;

  constructor(sprite: Sprite, isDestructible: boolean) {
    super(sprite);
    this.isDestructible = isDestructible;
  }
}
