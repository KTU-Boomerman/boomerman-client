import AbstractItemFactory from "../AbstractItemFactory";
import Item from "../Item";
import { Items } from "../Items";
import BasicBomb from "./BasicBomb";
import ReperitiveBomb from "./RepetitiveBomb";
import WaveBomb from "./WaveBomb";

export default class BombFactory extends AbstractItemFactory {
  createItem(item: Items): Item | null {
    switch (item) {
      case Items.BasicBomb:
        return new BasicBomb();
      case Items.RepetitiveBomb:
        return new ReperitiveBomb();
      case Items.WaveBomb:
        return new WaveBomb();
      default:
        return null;
    }
  }
}
