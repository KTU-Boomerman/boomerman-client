import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { UpdatePlayerDTO } from "../dtos/UpdatePlayerDTO";

export default class Server {
  private static instance: Server;
  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  private connection: HubConnection;
  private constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/game")
      .build();
  }

  async start() {
    await this.connection.start();
  }

  updatePlayer(player: UpdatePlayerDTO) {
    this.connection.invoke("UpdatePlayer", player);
  }

  onUpdateEnemy(callback: (enemy: UpdatePlayerDTO) => void) {
    this.connection.on("UpdateEnemy", callback);
  }
}
