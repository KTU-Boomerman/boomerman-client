import { DataTransferable } from '../dtos/DataTransferable';
import { PositionDTO } from '../dtos/PositionDTO';

export default class Position implements DataTransferable<PositionDTO> {
  private _x: number;
  private _y: number;

  static create(x: number, y: number): Position {
    return new Position({ x, y });
  }

  constructor(position: PositionDTO) {
    this._x = position.x;
    this._y = position.y;
  }

  get x(): number {
    return this._x;
  }

  set x(x: number) {
    this._x = x;
  }

  get y(): number {
    return this._y;
  }

  set y(y: number) {
    this._y = y;
  }

  toDTO() {
    return {
      x: this._x,
      y: this._y,
    };
  }

  clone(): Position {
    return new Position({ x: this._x, y: this._y });
  }

  equals(other: Position): boolean {
    return this._x === other._x && this._y === other._y;
  }
}
