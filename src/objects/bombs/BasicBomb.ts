import { BombDTO } from "../../dtos/BombDTO";
import { DataTransferable } from "../../dtos/DataTransferable";
import { BombType } from "../BombType";
import Item from "../Item";
import Position from "../Position";
import Sprite from "../../sprite/Sprite";

export default class BasicBomb
  extends Item
  implements DataTransferable<BombDTO>
{
  constructor(sprite: Sprite, position: Position) {
    super(sprite, position);
  }

  public explode(): void {
    throw new Error("Method not implemented.");
  }

  public toDTO(): BombDTO {
    return {
      bombType: BombType.Regular,
      position: this.position.toDTO(),
    };
  }
}
