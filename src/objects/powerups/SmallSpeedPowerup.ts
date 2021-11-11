import { DataTransferable } from "../../dtos/DataTransferable";
import Position from "../Position";
import Sprite from "../../sprite/Sprite";
import Powerup from "./Powerup";
import {PowerupDTO} from "../../dtos/PowerupDTO";
import {PowerupType} from "../PowerupType";

export default class SmallSpeedPowerup
    extends Powerup
    implements DataTransferable<PowerupDTO> {
    constructor(sprite: Sprite, position: Position) {
        super(sprite, position);
    }

    public toDTO(): PowerupDTO {
        return {
            powerupType: PowerupType.SmallSpeed,
            position: this.position.toDTO(),
        };
    }
}
