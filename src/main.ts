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
import { BombType } from "./objects/bombs/BombType";
import Bomb from "./objects/bombs/Bomb";

const keyboardManager = new KeyboardManager();

document.addEventListener("keydown", (event) => {
  keyboardManager.emit(event.key, "pressed");
});
document.addEventListener("keyup", (event) => {
  keyboardManager.emit(event.key, "released");
});

const server = Server.getInstance();

class Game extends AbstractGame {
  spriteFactory = new SpriteFactory();

  player?: Player;
  enemies = new Map<string, Enemy>();
  bombs: Bomb[] = [];

  gameState: GameState = GameState.PlayersJoining;

  async start(): Promise<void> {
    await server.start();
    this.mapEvents();
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

    if (this.player) renderer.render(this.player);

    for (const player of this.enemies.values()) {
      renderer.render(player);
    }
  }

  private async mapEvents() {
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

  private async loadEnemies(players: PlayerDTO[], sprite: Sprite) {
    for (const player of players) {
      await this.loadEnemy(player, sprite);
    }
  }

  private async loadEnemy(player: PlayerDTO, sprite: Sprite) {
    const enemy = new Enemy(sprite, player);
    this.enemies.set(enemy.id, enemy);
    await enemy.load();
  }

  private async loadPlayer(playerDto: PlayerDTO, sprite: Sprite) {
    const postion = new Position(playerDto.position);
    const newPlayer = new Player(
      sprite,
      playerDto.id,
      postion,
      keyboardManager
    );
    await newPlayer.load();

    this.player = newPlayer;
  }
}

new GameManager(new Game(), new Renderer()).start();
