export default class Position {
  private x: number;
  private y: number;

  static create(x: number, y: number): Position {
    return new Position(x, y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public addX(x: number): void {
    this.x += x;
  }

  public addY(y: number): void {
    this.y += y;
  }
}
