import { BombType } from "../objects/BombType";
import { PositionDTO } from "./PositionDTO";

export interface BombDTO {
  bombType: BombType;
  position: PositionDTO;
}
