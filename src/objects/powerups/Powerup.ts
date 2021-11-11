import Item from "../Item";
import Position from "../Position";

export default abstract class Powerup extends Item {
    RENDER_PRIORITY = 1;

    public setPosition(position: Position): void {
        this._position = position;
    }
}