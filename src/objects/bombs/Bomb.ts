import Item from "../Item";

export default abstract class Bomb extends Item {
  RENDER_PRIORITY = 1;

  public explode(): void {
    throw new Error("Method not implemented.");
  }
}
