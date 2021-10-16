import "./style.css";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/GameManager";
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
import WallBuilder from "./objects/walls/WallBuilder";
import GameObject from "./objects/GameObject";

const keyboardManager = new KeyboardManager();

document.addEventListener("keydown", (event) => {
  keyboardManager.emit(event.code, "pressed");
});
document.addEventListener("keyup", (event) => {
  keyboardManager.emit(event.code, "released");
});

const server = Server.getInstance();

// prettier-ignore
const map = [
  ["w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","w"],
  ["w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w"],
];

class Game extends AbstractGame {
  spriteFactory = new SpriteFactory();

  map: GameObject[][] = [];

  player?: Player;
  enemies = new Map<string, Enemy>();
  bombs: Bomb[] = [];

  gameState: GameState = GameState.PlayersJoining;

  async start(): Promise<void> {
    await server.start();
    await this.spriteFactory.loadImages();
    this.mapEvents();
    this.map = this.buildMap();
  }

  update(deltaTime: number): void {
    if (this.player && this.gameState == GameState.GameInProgress)
      this.player.update(deltaTime);

    for (const player of this.enemies.values()) {
      player.update(deltaTime);
    }
  }

  render(renderer: Renderer): void {
    renderer.reset();

    for (const row of this.map) {
      for (const cell of row) {
        renderer.render(cell);
      }
    }

    if (this.player) renderer.render(this.player);

    for (const player of this.enemies.values()) {
      renderer.render(player);
    }
  }

  private mapEvents() {
    const sprite = this.spriteFactory.createSprite("player");

    server.invoke("PlayerJoin");

    server.on("Joined", async (playerDto, playersDto, gameStateDto) => {
      await this.loadPlayer(playerDto, sprite);
      await this.loadEnemies(playersDto, sprite);
      this.gameState = gameStateDto.gameState;
    });

    server.on("GameStateChanged", (gameStateDto) => {
      this.gameState = gameStateDto.gameState;
    });

    server.on("PlayerJoined", async (playerDto) => {
      await this.loadEnemy(playerDto, sprite);
    });

    server.on("PlayerLeave", (playerId) => {
      this.enemies.delete(playerId);
    });

    server.on("PlayerMove", (playerId, position) => {
      const player = this.enemies.get(playerId);
      if (!player) return;

      player.position = new Position(position);
      this.enemies.set(playerId, player);
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
  }

  private loadPlayer(playerDto: PlayerDTO, sprite: Sprite) {
    const postion = new Position(playerDto.position);
    const newPlayer = new Player(
      sprite,
      playerDto.id,
      postion,
      keyboardManager
    );

    this.player = newPlayer;
  }

  private buildMap(): GameObject[][] {
    const wallBuilder = new WallBuilder().setSprite(
      this.spriteFactory.createSprite("wall")
    );
    const grassBuilder = new WallBuilder().setSprite(
      this.spriteFactory.createSprite("grass")
    );

    return map.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const position = Position.create(cellIndex * 32, rowIndex * 32);

        if (cell === "w") {
          return wallBuilder.setPosition(position).build();
        }

        return grassBuilder.setPosition(position).build();
      })
    );
  }
}

new GameManager(new Game(), new Renderer()).start();
