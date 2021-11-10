import Position from "./Position";
import GameObject from "./GameObject";
import Sprite from "../sprite/Sprite";
import { PlayerDTO } from "../dtos/PlayerDTO";
import { Lives } from "../core/managers/UIManager";

export default class Enemy extends GameObject {
  private _id: string = "";
  private _position: Position;
  private _lives: Lives = 3;
  private _dyingTime = 0;

  constructor(private sprite: Sprite, private spriteDying: Sprite, playerDto: PlayerDTO) {
    super();
    this._id = playerDto.id;
    this._position = new Position(playerDto.position);
  }

  get id() {
    return this._id;
  }

  set position(position: Position) {
    this._position = position;
  }

  set lives(lives: Lives) {
    if (lives < this._lives) {
      this._dyingTime = 1000;
    }
    this._lives = lives;
  }

  
  update(deltaTime: number) {
    if (this._lives == 0) return;
    this.updateDyingTimer(deltaTime);
  }
  
  private updateDyingTimer(deltaYime: number) {
    this._dyingTime -= deltaYime;
    if (this._dyingTime < 0) this._dyingTime = 0;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    if (this._lives == 0) return;

    const sprite = this._dyingTime > 0 ? this.spriteDying : this.sprite;

    sprite.draw(context, this._position);
  }
}
