import { PositionDTO } from './PositionDTO';
import { PowerupType } from '../objects/PowerupType';

export interface PowerupDTO {
  powerupType: PowerupType;
  position: PositionDTO;
}
