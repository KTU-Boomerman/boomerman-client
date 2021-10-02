import Item from "../Item";

export default class Bomb extends Item {
  public explode(): void {
    throw new Error("Method not implemented.");
  }
}
