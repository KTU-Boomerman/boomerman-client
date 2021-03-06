import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BombDTO } from '../dtos/BombDTO';
import { CreateBombDTO } from '../dtos/CreateBombDTO';
import { GameStateDTO } from '../dtos/GameStateDTO';
import { PlayerDTO } from '../dtos/PlayerDTO';
import { PositionDTO } from '../dtos/PositionDTO';
import { MapDTO } from '../dtos/MapDTO';
import { Lives } from './managers/UIManager';
import { PowerupDTO } from '../dtos/PowerupDTO';
import { PlayerColorDTO } from '../dtos/PlayerColorDTO';

type InvokeEventMap = {
  PlayerJoin: () => void;
  PlayerMove: (originalPosition: PositionDTO, newPosition: PositionDTO) => PositionDTO;
  PlaceBomb: (bomb: CreateBombDTO) => void;
  SendMessage: (message: string) => void;
  ChangePlayerColor: () => void;
  PlayerUnwind: () => void;
};

type OnEventMap = {
  PlayerJoin: (player: PlayerDTO) => void;
  Joined: (player: PlayerDTO, players: PlayerDTO[], gameStateDto: GameStateDTO, map: MapDTO) => void;
  GameStateChanged: (gameState: GameStateDTO) => void;
  PlayerLeave: (playerId: string) => void;
  PlayerMove: (playerId: string, position: PositionDTO) => void;
  PlayerPlaceBomb: (bomb: BombDTO) => void;
  Notification: (title: string, message: string) => void;
  Explosions: (positions: PositionDTO[]) => void;
  UpdateLives: (playerId: string, lives: Lives) => void;
  UpdateScore: (playerId: string, score: number) => void;
  UpdateBombCount: (playerId: string, score: number) => void;
  PlacePowerup: (powerup: PowerupDTO) => void;
  RemovePowerup: (position: PositionDTO) => void;
  SendMessage: (playerId: string, playerName: string, message: string) => void;
  PlayerChangeColor: (playerId: string, playerColorDto: PlayerColorDTO) => void;
  UnwindPlayer: (playerId: string, player: PlayerDTO) => void;
};

export default class Server {
  private static instance: Server;
  public static getInstance(): Server {
    return Server.instance ?? (Server.instance = new Server());
  }

  private connection: HubConnection;
  private constructor() {
    if (!import.meta.env.VITE_SERVER_URL) {
      throw new Error('VITE_SERVER_URL is not defined');
    }

    this.connection = new HubConnectionBuilder().withUrl(import.meta.env.VITE_SERVER_URL).build();
  }

  public async invoke<Event extends keyof InvokeEventMap>(
    event: Event,
    ...args: Parameters<InvokeEventMap[Event]>
  ): Promise<ReturnType<InvokeEventMap[Event]>> {
    return await this.connection.invoke(event, ...args);
  }

  public on<Event extends keyof OnEventMap>(event: Event, callback: OnEventMap[Event]) {
    this.connection.on(event, callback);
  }

  async start() {
    await this.connection.start();
  }
}
