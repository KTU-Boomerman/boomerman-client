import Item from "./Item";
import { Items } from "./Items";
import Position from "./Position";

export default abstract class AbstractItemFactory {
  abstract createItem(item: Items, position: Position): Item | null;
}
