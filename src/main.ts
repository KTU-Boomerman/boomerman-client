import "./style.css";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/GameManager";
import Player from "./objects/Player";
import Server from "./core/Server";
import Enemy from "./objects/Enemy";
import GameObject from "./objects/GameObject";
import Sprite from "./objects/Sprite";

class Game extends AbstractGame {
  server = Server.getInstance();

  players = new Map<number, GameObject>();
  sprites = new Map<string, Sprite>();

  async start(): Promise<void> {
    await this.server.start();
    await this.loadSprites();
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

  private async loadSprites(): Promise<void> {
    this.sprites.set("player", new Sprite("../assets/player.png"));

    await Promise.all(
      Array.from(this.sprites.values()).map((sprite) => sprite.load())
    );
  }

  private loadEnemies() {
    this.server.onUpdateEnemy((enemyDto) => {
      const enemy = new Enemy(this.sprites.get("player")!, enemyDto);
      this.players.set(enemy.id, enemy);
    });
  }

  private loadPlayer() {
    const newPlayer = new Player(this.sprites.get("player")!);
    this.players.set(newPlayer.id, newPlayer);
  }
}

new GameManager(new Game(), new Renderer()).start();
