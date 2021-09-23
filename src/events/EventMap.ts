import { PlayerDTO } from "../core/dtos/PlayerDTO";

export type EventMap = {
  "update-player": { player: PlayerDTO };
  "update-enemy": { enemy: PlayerDTO };
};
