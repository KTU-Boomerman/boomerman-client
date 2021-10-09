import Sprite from "../../sprite/Sprite";
import Position from "../Position";
import Wall from "./Wall";

export default class WallBuilder {
  private isDestructible = false;
  private sprite: Sprite | null = null;
  private position: Position | null = null;

  setSprite(sprite: Sprite) {
    this.sprite = sprite;
    return this;
  }

  setIsDestructible(isDestructible: boolean): WallBuilder {
    this.isDestructible = isDestructible;
    return this;
  }

  setPosition(position: Position): WallBuilder {
    this.position = position;
    return this;
  }

  build(): Wall {
    if (this.sprite == null) throw new Error("Sprite is not set");
    if (this.position == null) throw new Error("Position is not set");
    return new Wall(this.sprite, this.isDestructible, this.position);
  }
}
