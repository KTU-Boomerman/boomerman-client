import { inject, singleton } from "tsyringe";
import Sprite from "../../sprite/Sprite";
import SpriteFactory from "../../sprite/SpriteFactory";
import Position from "../Position";
import {PowerupType} from "../PowerupType";
import Powerup from "./Powerup";
import BigHealthPowerup from "./BigHealthPowerup";
import SmallHealthPowerup from "./SmallHealthPowerup";
import BigSpeedPowerup from "./BigSpeedPowerup";
import SmallSpeedPowerup from "./SmallSpeedPowerup";
import BigBombPowerup from "./BigBombPowerup";
import SmallBombPowerup from "./SmallBombPowerup";

@singleton()
export class PowerupFactory {
    bigHealthSprite: Sprite;
    smallHealthSprite: Sprite;
    bigSpeedSprite: Sprite;
    smallSpeedSprite: Sprite;
    bigBombSprite: Sprite;
    smallBombSprite: Sprite;

    constructor(@inject(SpriteFactory) private spriteFactory: SpriteFactory) {
        this.bigHealthSprite = this.spriteFactory.createSprite("bHealthPowerup");
        this.smallHealthSprite = this.spriteFactory.createSprite("sHealthPowerup");
        this.bigSpeedSprite = this.spriteFactory.createSprite("bSpeedPowerup");
        this.smallSpeedSprite = this.spriteFactory.createSprite("sSpeedPowerup");
        this.bigBombSprite = this.spriteFactory.createSprite("bBombPowerup");
        this.smallBombSprite = this.spriteFactory.createSprite("sBombPowerup");
    }

    createBomb(position: Position, powerupType: PowerupType): Powerup {
        switch (powerupType) {
            case PowerupType.BigHealth:
                return new BigHealthPowerup(this.bigHealthSprite, position);
            case PowerupType.SmallHealth:
                return new SmallHealthPowerup(this.smallHealthSprite, position);
            case PowerupType.BigSpeed:
                return new BigSpeedPowerup(this.bigSpeedSprite, position);
            case PowerupType.SmallSpeed:
                return new SmallSpeedPowerup(this.smallSpeedSprite, position);
            case PowerupType.BigBomb:
                return new BigBombPowerup(this.bigBombSprite, position);
            case PowerupType.SmallBomb:
                return new SmallBombPowerup(this.smallBombSprite, position);

        }
    }
}
