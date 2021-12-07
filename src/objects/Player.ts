import Position from './Position';
import GameObject from './GameObject';
import Sprite from '../sprite/Sprite';
import { DataTransferable } from '../dtos/DataTransferable';
import { PlayerDTO } from '../dtos/PlayerDTO';
import { IKeyboardManager } from '../core/managers/IKeyboardManager';
import { Game } from '../core/Game';
import { Lives } from '../core/managers/UIManager';
import { PlayerColor } from './PlayerColor';

export default class Player extends GameObject implements DataTransferable<PlayerDTO> {
  RENDER_PRIORITY = 10;

  private _id = '';
  private _position: Position;
  private _speed = 0.2;
  private _keyboardManager?: IKeyboardManager;
  private _lives: Lives = 3;
  private _dyingTime = 0;
  private _color: PlayerColor | null = null;

  constructor(private sprite: Sprite, private spriteDying: Sprite, position: Position, private game: Game) {
    super();
    this._position = position;
  }

  update(deltaTime: number) {
    if (this._lives == 0) return;
    this.updateDyingTimer(deltaTime);
    this.updatePosition(deltaTime);
  }

  isDead() {
    return this._lives <= 0;
  }

  render(context: CanvasRenderingContext2D): void {
    if (this._position == null) return;
    if (this._lives == 0) return;

    const sprite = this._dyingTime > 0 ? this.spriteDying : this.sprite;

    sprite.draw(context, this._position, { color: this._color });
  }

  set lives(lives: Lives) {
    if (lives < this._lives) {
      this._dyingTime = 1000;
    }

    this._lives = lives;
  }

  set id(id: string) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set position(position: Position) {
    this._position = position;
  }

  get position() {
    return this._position;
  }

  set keyboardManager(keyboardManager: IKeyboardManager) {
    this._keyboardManager = keyboardManager;
  }

  set color(color: PlayerColor) {
    this._color = color;
  }

  toDTO() {
    return {
      id: this._id,
      position: this._position.toDTO(),
      color: this._color,
      lives: this._lives,
    };
  }

  private updateDyingTimer(deltaTime: number) {
    this._dyingTime -= deltaTime;
    if (this._dyingTime < 0) this._dyingTime = 0;
  }

  public updatePosition(deltaTime: number) {
    const [dx, dy] = this.getMoveDirection();

    if (dx == 0 && dy == 0) return;
    if (this._position == null) return;

    const newPosition = Position.create(
      this._position.x + dx * this._speed * deltaTime,
      this._position.y + dy * this._speed * deltaTime,
    );

    this.game.onPlayerPositionUpdate(this._position.toDTO(), newPosition.toDTO());
  }

  private getMoveDirection(): [number, number] {
    let x = 0;
    let y = 0;

    if (this._keyboardManager?.isPressed('ArrowUp')) y--;
    if (this._keyboardManager?.isPressed('ArrowDown')) y++;
    if (this._keyboardManager?.isPressed('ArrowRight')) x++;
    if (this._keyboardManager?.isPressed('ArrowLeft')) x--;

    if (x != 0 && y != 0) {
      x *= Math.sqrt(0.5);
      y *= Math.sqrt(0.5);
    }

    return [x, y];
  }
}
