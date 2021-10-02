import GameObject from "./GameObject";

export default class Item extends GameObject {
  async load() {
    await this._sprite.load();
  }
}
