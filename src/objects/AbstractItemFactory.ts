import Item from "./Item";
import { Items } from "./Items";

export default abstract class AbstractItemFactory {
  abstract createItem(item: Items): Item | null;
}
