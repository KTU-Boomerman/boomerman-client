export default class Position {
  private _x: number;
  private _y: number;

  static create(x: number, y: number): Position {
    return new Position(x, y);
  }

  static fromTuple([x, y]: [number, number]): Position {
    return new Position(x, y);
  }

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public set x(x: number) {
    this._x = x;
  }

  public set y(y: number) {
    this._y = y;
  }
}
