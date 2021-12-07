import { Lives } from '../core/managers/UIManager';
import { PlayerColor } from '../objects/PlayerColor';
import { PositionDTO } from './PositionDTO';

export interface PlayerDTO {
  id: string;
  position: PositionDTO;
  color: PlayerColor | null;
  lives: Lives;
}
