import AbstractGame from "./AbstractGame";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";
import Position from "../objects/Position";
import { PlayerDTO } from "../dtos/PlayerDTO";
import Sprite from "../sprite/Sprite";
import { GameState } from "../objects/GameState";
import Bomb from "../objects/bombs/Bomb";
import BasicBomb from "../objects/bombs/BasicBomb";
import { BombType } from "../objects/BombType";
import { inject, singleton } from "tsyringe";
import {
  IKeyboardListener,
  IKeyboardManager,
  Key,
  KeyState,
} from "./managers/IKeyboardManager";
import Server from "./Server";
import Renderer from "./Renderer";
import SpriteFactory from "../sprite/SpriteFactory";
import BoomerangBomb from "../objects/bombs/BoomerangBomb";
import WaveBomb from "../objects/bombs/WaveBomb";
import PulseBomb from "../objects/bombs/PulseBomb";
import { PositionDTO } from "../dtos/PositionDTO";

@singleton()
export class Game extends AbstractGame implements IKeyboardListener {
  player: Player;
  enemies: Map<string, Enemy>;
  bombs: Bomb[];
  gameState: GameState;

  playerSprite: Sprite;

  constructor(
    @inject("IKeyboardManager") private keyboardManager: IKeyboardManager,
    @inject("Server") private server: Server,
    @inject("GameRenderer") private gameRenderer: Renderer,
    @inject(SpriteFactory) public spriteFactory: SpriteFactory
  ) {
    super();

    this.playerSprite = this.spriteFactory.createSprite("player");

    this.gameState = GameState.PlayersJoining;

    this.enemies = new Map();
    this.bombs = [];

    this.player = new Player(this.playerSprite, Position.create(0, 0), this);

    this.player.keyboardManager = this.keyboardManager;
  }

  async start(): Promise<void> {
    this.mapEvents();
  }

  update(deltaTime: number): void {
    if (this.gameState == GameState.GameInProgress)
      this.player.update(deltaTime);

    for (const player of this.enemies.values()) {
      player.update(deltaTime);
    }
  }

  private mapEvents() {
    this.server.invoke("PlayerJoin");

    this.server.on("Joined", async (playerDto, playersDto, gameStateDto) => {
      this.loadPlayer(playerDto);
      this.loadEnemies(playersDto, this.playerSprite);
      this.gameState = gameStateDto.gameState;
    });

    this.server.on("GameStateChanged", (gameStateDto) => {
      this.gameState = gameStateDto.gameState;
    });

    this.server.on("PlayerJoin", async (playerDto) => {
      this.loadEnemy(playerDto, this.playerSprite);
    });

    this.server.on("PlayerLeave", (playerId) => {
      const enemy = this.enemies.get(playerId);
      if (enemy) this.gameRenderer.remove(enemy);

      this.enemies.delete(playerId);
    });

    this.server.on("PlayerMove", (playerId, position) => {
      const player = this.enemies.get(playerId);
      if (!player) return;

      player.position = new Position(position);
      this.enemies.set(playerId, player);
    });

    this.server.on("PlayerPlaceBomb", (bombDto) => {
      const bomb = new BasicBomb(
        this.spriteFactory.createSprite("regularBomb"),
        new Position(bombDto.position)
      );
      this.bombs.push(bomb);

      this.gameRenderer.add(bomb);
    });
  }

  async onPlayerPositionUpdate(
    position: PositionDTO,
    newPosition: PositionDTO
  ) {
    const currentPosition = await this.server.invoke(
      "PlayerMove",
      position,
      newPosition
    );

    this.player.position = new Position(currentPosition);
  }

  onKey(key: Key, state: KeyState): void {
    if (key == "KeyZ" && state == "pressed") {
      const bomb = new BasicBomb(
        this.spriteFactory.createSprite("regularBomb"),
        this.player.position.clone()
      );

      this.addBomb(bomb);
    }
    if (key == "KeyX" && state == "pressed") {
      const bomb = new BoomerangBomb(
        this.spriteFactory.createSprite("boomerangBomb"),
        this.player.position.clone()
      );

      this.addBomb(bomb, BombType.Boomerang);
    }
    if (key == "KeyC" && state == "pressed") {
      const bomb = new WaveBomb(
        this.spriteFactory.createSprite("waveBomb"),
        this.player.position.clone()
      );

      this.addBomb(bomb, BombType.Wave);
    }
    if (key == "KeyV" && state == "pressed") {
      const bomb = new PulseBomb(
        this.spriteFactory.createSprite("pulseBomb"),
        this.player.position.clone()
      );

      this.addBomb(bomb, BombType.Pulse);
    }
  }

  private async addBomb(bomb: Bomb, bombType: BombType = BombType.Regular) {
    const positionDTO = await this.server.invoke("PlaceBomb", { bombType });
    bomb.setPosition(new Position(positionDTO));
    this.bombs.push(bomb);
    this.gameRenderer.add(bomb);
  }

  private loadEnemies(players: PlayerDTO[], sprite: Sprite) {
    for (const player of players) {
      this.loadEnemy(player, sprite);
    }
  }

  private loadEnemy(player: PlayerDTO, sprite: Sprite) {
    const enemy = new Enemy(sprite, player);
    this.enemies.set(enemy.id, enemy);

    this.gameRenderer.add(enemy);
  }

  private loadPlayer(playerDto: PlayerDTO) {
    const postion = new Position(playerDto.position);
    this.player.id = playerDto.id;
    this.player.position = postion;

    this.gameRenderer.add(this.player);
  }
}
