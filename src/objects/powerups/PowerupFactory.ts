import AbstractItemFactory from "../AbstractItemFactory";
import Item from "../Item";
import { Items } from "../Items";
import GodPowerup from "./GodPowerup";
import LifePowerup from "./LifePowerup";
import SpeedPowerup from "./SpeedPowerup";

export default class PowerupFactory extends AbstractItemFactory {
  createItem(item: Items): Item | null {
    switch (item) {
      case Items.GodPowerup:
        return new GodPowerup();
      case Items.LifePowerup:
        return new LifePowerup();
      case Items.SpeedPowerup:
        return new SpeedPowerup();
      default:
        return null;
    }
  }
}
