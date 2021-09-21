import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import Position from "../objects/Position";
import { Listen } from "./Listen";

export default class Server {
  private connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/game")
      .build();
  }

  start() {
    this.connection.start();
  }

  @Listen("update-position")
  updatePosition(position: Position) {
    this.connection.invoke("UpdatePosition", position);
  }
}
