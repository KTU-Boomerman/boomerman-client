import Sprite from "../../sprite/Sprite";
import Wall from "./Wall";

export default class WallBuilder {
  private isDestructible = false;
  private sprite: Sprite | null = null;

  setSprite(sprite: Sprite) {
    this.sprite = sprite;
    return this;
  }

  setIsDestructible(isDestructible: boolean): WallBuilder {
    this.isDestructible = isDestructible;
    return this;
  }

  build(): Wall {
    if (this.sprite == null) throw new Error("Sprite is not set");
    return new Wall(this.sprite, this.isDestructible);
  }
}
