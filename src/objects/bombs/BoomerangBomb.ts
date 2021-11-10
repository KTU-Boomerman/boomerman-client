import Position from "../Position";
import Sprite from "../../sprite/Sprite";
import Bomb from "./Bomb";

export default class BoomerangBomb extends Bomb {
  constructor(sprite: Sprite, position: Position) {
    super(sprite, position);
  }
}
