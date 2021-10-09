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

class Game extends AbstractGame {
  server = Server.getInstance();
  spriteFactory = new SpriteFactory();

  player?: Player;
  enemies = new Map<string, Enemy>();

  async start(): Promise<void> {
    await this.server.start();
    this.mapEvents();
  }

  update(deltaTime: number): void {
    if (this.player) this.player.update(deltaTime);

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

    this.server.playerJoin();

    this.server.onJoined(async (playerDto, playersDto) => {
      await this.loadPlayer(playerDto, sprite);
      await this.loadEnemies(playersDto, sprite);
    });

    this.server.onPlayerJoin(async (playerDto) => {
      await this.loadEnemy(playerDto, sprite);
      console.log("player join", this.enemies.size);
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
    const newPlayer = new Player(sprite, playerDto.id, postion);
    await newPlayer.load();

    this.player = newPlayer;
  }
}

new GameManager(new Game(), new Renderer()).start();
