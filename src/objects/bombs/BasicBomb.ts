import { BombDTO } from "../../dtos/BombDTO";
import { DataTransferable } from "../../dtos/DataTransferable";
import { BombType } from "../BombType";
import Position from "../Position";
import Sprite from "../../sprite/Sprite";
import Bomb from "./Bomb";

export default class BasicBomb
  extends Bomb
  implements DataTransferable<BombDTO> {
  constructor(sprite: Sprite, position: Position) {
    super(sprite, position);
  }

  public toDTO(): BombDTO {
    return {
      bombType: BombType.Regular,
      position: this.position.toDTO(),
    };
  }
}
