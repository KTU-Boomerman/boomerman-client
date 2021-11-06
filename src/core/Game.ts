import AbstractGame from "./AbstractGame";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";
import Position from "../objects/Position";
import { PlayerDTO } from "../dtos/PlayerDTO";
import Sprite from "../sprite/Sprite";
import { GameState } from "../objects/GameState";
import Bomb from "../objects/bombs/Bomb";
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
import { PositionDTO } from "../dtos/PositionDTO";
import { Explosion } from "../objects/Explosion";
import { BombFactory } from "../objects/bombs/BombFactory";
import { MapDTO } from "../dtos/MapDTO";
import WallBuilder from "../objects/walls/WallBuilder";
import Wall from "../objects/walls/Wall";
import {UIManager} from './managers/UIManager';

@singleton()
export class Game extends AbstractGame implements IKeyboardListener {
  player: Player;
  enemies: Map<string, Enemy>;
  bombs: Bomb[];
  walls: Wall[] = [];
  gameState: GameState;

  playerSprite: Sprite;
  explosionSprite: Sprite;

  constructor(
    @inject("IKeyboardManager") private keyboardManager: IKeyboardManager,
    @inject("Server") private server: Server,
    @inject("GameRenderer") private gameRenderer: Renderer,
    @inject(SpriteFactory) public spriteFactory: SpriteFactory,
    @inject(BombFactory) public bombFactory: BombFactory,
    @inject(UIManager) private uiManager: UIManager,
  ) {
    super();

    this.playerSprite = this.spriteFactory.createSprite("player");
    this.explosionSprite = this.spriteFactory.createSprite("explosion");

    this.gameState = GameState.PlayersJoining;

    this.enemies = new Map();
    this.bombs = [];

    this.player = new Player(this.playerSprite, Position.create(0, 0), this);

    this.player.keyboardManager = this.keyboardManager;
    
    this.uiManager.render();
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

    this.server.on(
      "Joined",
      async (playerDto, playersDto, gameStateDto, mapDto) => {
        this.loadPlayer(playerDto);
        this.loadEnemies(playersDto, this.playerSprite);
        this.loadMap(mapDto);
        this.gameState = gameStateDto.gameState;
      }
    );

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
      const position = new Position(bombDto.position);
      const bomb = this.bombFactory.createBomb(position, bombDto.bombType);

      this.bombs.push(bomb);
      this.gameRenderer.add(bomb);
    });

    this.server.on("Explosions", (positionsDto) => {
      positionsDto.forEach(dto => {
        const position = new Position(dto);
        // remove bomb
        const bomb = this.bombs.find((b) => b.position.equals(position));

        if (bomb) {
          this.bombs = this.bombs.filter((b) => b != bomb);
          this.gameRenderer.remove(bomb);
        }

        // add explosion
        const explosion = new Explosion(this.explosionSprite, position);
        this.gameRenderer.add(explosion);

        // break wall
        const wall = this.walls.find((w) => w.position.equals(position));
        if (wall) this.gameRenderer.remove(wall);

        setTimeout(() => {
          this.gameRenderer.remove(explosion);
        }, 1000);
      });
    });

    this.server.on("UpdateLives", (lives) => {
      this.uiManager.updateLives(lives);
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
    if (state == "pressed") {
      switch (key) {
        case "KeyZ":
          this.addBomb();
          break;
        case "KeyX":
          this.addBomb(BombType.Boomerang);
          break;
        case "KeyC":
          this.addBomb(BombType.Wave);
          break;
        case "KeyV":
          this.addBomb(BombType.Pulse);
          break;
        default:
          break;
      }
    }
  }

  private addBomb(bombType: BombType = BombType.Regular) {
    this.server.invoke("PlaceBomb", { bombType });
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

  private loadMap(mapDto: MapDTO) {
    const destructibleWallBuilder = new WallBuilder()
      .setSprite(this.spriteFactory.createSprite("destructibleWall"))
      .setIsDestructible(true);

    mapDto.walls.forEach((wPos) => {
      let wall = destructibleWallBuilder
        .setPosition(new Position(wPos))
        .build();
      this.walls.push(wall);
      this.gameRenderer.add(wall);
    });
  }
}
