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
import WallBuilder from "./objects/walls/WallBuilder";
import GameObject from "./objects/GameObject";

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
  server = Server.getInstance();
  spriteFactory = new SpriteFactory();

  isLoading = true;

  map: GameObject[][] = [];

  player?: Player;
  enemies = new Map<string, Enemy>();

  gameState: GameState = GameState.PlayersJoining;

  async start(): Promise<void> {
    await this.spriteFactory.loadImages();
    await this.server.start();
    this.mapEvents();
    this.map = this.buildMap();

    this.isLoading = false;
  }

  update(deltaTime: number): void {
    if (this.player && this.gameState == GameState.GameInProgress)
      this.player.update(deltaTime);

    for (const player of this.enemies.values()) {
      player.update(deltaTime);
    }
  }

  render(renderer: Renderer): void {
    if (this.isLoading) return;
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

    this.server.playerJoin();

    this.server.onJoined((playerDto, playersDto, gameStateDto) => {
      this.loadPlayer(playerDto, sprite);
      this.loadEnemies(playersDto, sprite);
      this.gameState = gameStateDto.gameState;
    });

    this.server.onGameStateChanged((gameStateDto) => {
      this.gameState = gameStateDto.gameState;
    });

    this.server.onPlayerJoin((playerDto) => {
      this.loadEnemy(playerDto, sprite);
    });

    this.server.onPlayerLeave((playerId) => {
      this.enemies.delete(playerId);
    });

    this.server.onPlayerMove((playerId, position) => {
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
    const newPlayer = new Player(sprite, playerDto.id, postion);

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
