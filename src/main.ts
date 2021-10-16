import "./style.css";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/managers/GameManager";
import Player from "./objects/Player";
import Server from "./core/Server";
import Enemy from "./objects/Enemy";
import SpriteFactory from "./sprite/SpriteFactory";
import Position from "./objects/Position";
import { PlayerDTO } from "./dtos/PlayerDTO";
import Sprite from "./sprite/Sprite";
import { GameState } from "./objects/GameState";
import { KeyboardManager } from "./core/managers/KeyboardManager";
import Bomb from "./objects/bombs/Bomb";
import GameObject from "./objects/GameObject";
import BasicBomb from "./objects/bombs/BasicBomb";
import { BackgroundManager } from "./core/managers/BackgroundManager";

const keyboardManager = new KeyboardManager();

document.addEventListener("keydown", (event) => {
  keyboardManager.emit(event.code, "pressed");
});
document.addEventListener("keyup", (event) => {
  keyboardManager.emit(event.code, "released");
});

const server = Server.getInstance();
const spriteFactory = new SpriteFactory();

const gameCanvas = document.getElementById("game") as HTMLCanvasElement;
const gameRenderer = new Renderer(gameCanvas);

const backgroundCanvas = document.getElementById(
  "background"
) as HTMLCanvasElement;
const backgroundRenderer = new Renderer(backgroundCanvas);
const mapManager = new BackgroundManager(spriteFactory, backgroundRenderer);

class Game extends AbstractGame {
  map: GameObject[][] = [];

  player: Player = new Player(
    spriteFactory.createSprite("player"),
    Position.create(0, 0),
    keyboardManager
  );
  enemies = new Map<string, Enemy>();
  bombs: Bomb[] = [];

  gameState: GameState = GameState.PlayersJoining;

  async start(): Promise<void> {
    this.mapEvents();
  }

  update(deltaTime: number): void {
    if (this.player && this.gameState == GameState.GameInProgress)
      this.player.update(deltaTime);

    for (const player of this.enemies.values()) {
      player.update(deltaTime);
    }
  }

  private mapEvents() {
    const playerSprite = spriteFactory.createSprite("player");
    const bombSprite = spriteFactory.createSprite("bomb");

    server.invoke("PlayerJoin");

    server.on("Joined", async (playerDto, playersDto, gameStateDto) => {
      await this.loadPlayer(playerDto);
      await this.loadEnemies(playersDto, playerSprite);
      this.gameState = gameStateDto.gameState;
    });

    server.on("GameStateChanged", (gameStateDto) => {
      this.gameState = gameStateDto.gameState;
    });

    server.on("PlayerJoined", async (playerDto) => {
      await this.loadEnemy(playerDto, playerSprite);
    });

    server.on("PlayerLeave", (playerId) => {
      const enemy = this.enemies.get(playerId);
      if (enemy) gameRenderer.remove(enemy);

      this.enemies.delete(playerId);
    });

    server.on("PlayerMove", (playerId, position) => {
      const player = this.enemies.get(playerId);
      if (!player) return;

      player.position = new Position(position);
      this.enemies.set(playerId, player);
    });

    keyboardManager.on("KeyZ", (state) => {
      if (state == "released") {
        const bomb = new BasicBomb(bombSprite, this.player.position.clone());
        this.bombs.push(bomb);
        gameRenderer.add(bomb);
      }
    });
  }

  private loadEnemies(players: PlayerDTO[], sprite: Sprite) {
    for (const player of players) {
      this.loadEnemy(player, sprite);
    }
  }

  private loadEnemy(player: PlayerDTO, sprite: Sprite) {
    const enemy = new Enemy(sprite, player);
    this.enemies.set(enemy.id, enemy);

    gameRenderer.add(enemy);
  }

  private loadPlayer(playerDto: PlayerDTO) {
    const postion = new Position(playerDto.position);
    this.player.id = playerDto.id;
    this.player.position = postion;

    gameRenderer.add(this.player);
  }
}

(async () => {
  await server.start();
  await spriteFactory.loadImages();
  mapManager.buildBackground();
  mapManager.render();
  await new GameManager(new Game(), gameRenderer).start();
})();
