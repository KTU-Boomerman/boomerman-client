import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { EventEmitter } from "../events/EventEmitter";
import { PlayerDTO } from "./dtos/PlayerDTO";

export default class Server {
  private connection: HubConnection;

  constructor(private eventEmitter: EventEmitter) {
    this.connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/game")
      .build();

    this.eventEmitter.on("update-player", ({ player }) => {
      this.updatePlayer(player);
    });

    this.connection.on("UpdateEnemy", (enemy: PlayerDTO) => {
      // console.log("Updated enemy", enemy);
      this.eventEmitter.emit("update-enemy", { enemy });
    });
  }

  start() {
    this.connection.start();
  }

  updatePlayer(player: PlayerDTO) {
    // console.log("Updated player", player);
    this.connection.invoke("UpdatePlayer", player);
  }
}
