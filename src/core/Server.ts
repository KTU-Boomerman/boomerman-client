import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GameStateDTO } from "../dtos/GameStateDTO";
import { PlayerDTO } from "../dtos/PlayerDTO";
import { PositionDTO } from "../dtos/PositionDTO";

export default class Server {
  private static instance: Server;
  public static getInstance(): Server {
    return Server.instance ?? (Server.instance = new Server());
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

  playerJoin() {
    this.connection.invoke("PlayerJoin");
  }

  // add other player
  onPlayerJoin(callback: (player: PlayerDTO) => void) {
    this.connection.on("PlayerJoin", callback);
  }

  // on caller joined
  onJoined(
    callback: (
      player: PlayerDTO,
      playersDto: PlayerDTO[],
      gameStateDto: GameStateDTO
    ) => void
  ) {
    this.connection.on("Joined", callback);
  }

  onGameStateChanged(callback: (gameState: GameStateDTO) => void) {
    this.connection.on("GameStateChanged", callback);
  }

  onPlayerLeave(callback: (playerId: string) => void) {
    this.connection.on("PlayerLeave", callback);
  }

  async playerMove(
    position: PositionDTO
  ): Promise<{ isValid: boolean; position?: PositionDTO }> {
    return await this.connection.invoke("PlayerMove", position);
  }

  onPlayerMove(callback: (playerId: string, position: PositionDTO) => void) {
    this.connection.on("PlayerMove", callback);
  }
}
