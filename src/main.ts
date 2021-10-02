import "./style.css";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/GameManager";
import Player from "./objects/Player";
import Server from "./core/Server";
import Enemy from "./objects/Enemy";
import GameObject from "./objects/GameObject";
import SpriteFactory from "./sprite/SpriteFactory";

class Game extends AbstractGame {
  server = Server.getInstance();
  spriteFactory = new SpriteFactory();

  players = new Map<number, GameObject>();

  async start(): Promise<void> {
    await this.server.start();
    this.loadPlayer();
    this.loadEnemies();
  }

  update(deltaTime: number): void {
    for (const player of this.players.values()) {
      player.update(deltaTime);
    }
  }

  render(renderer: Renderer): void {
    renderer.reset();

    for (const player of this.players.values()) {
      renderer.render(player);
    }
  }

  private async loadEnemies() {
    const sprite = this.spriteFactory.createSprite("player");

    // TODO: load on start and update position afterwards
    this.server.onUpdateEnemy(async (enemyDto) => {
      const enemy = new Enemy(sprite, enemyDto);
      await enemy.load();
      this.players.set(enemy.id, enemy);
    });
  }

  private async loadPlayer() {
    const sprite = this.spriteFactory.createSprite("player");

    const newPlayer = new Player(sprite);
    await newPlayer.load();
    this.players.set(newPlayer.id, newPlayer);
  }
}

new GameManager(new Game(), new Renderer()).start();
