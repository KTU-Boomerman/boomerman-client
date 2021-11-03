import Item from "../Item";
import Position from "../Position";
import Sprite from "../../sprite/Sprite";

export default class BoomerangBomb extends Item {
    constructor(sprite: Sprite, position: Position) {
        super(sprite, position);
    }

    public explode(): void {
        throw new Error("Method not implemented.");
    }
}
