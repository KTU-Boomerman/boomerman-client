import "./style.css";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/GameManager";
import Player from "./objects/Player";
import { EventEmitter } from "./events/EventEmitter";
import Server from "./core/Server";
import Enemy from "./objects/Enemy";
import GameObject from "./objects/GameObject";

const eventEmitter = EventEmitter.getInstance();
const server = new Server(eventEmitter);
const player = new Player(eventEmitter);

class Game extends AbstractGame {
  players = new Map<number, GameObject>();

  // TODO: refactor sprites from player
  async start(): Promise<void> {
    this.players.set(player.getId(), player);
    // await player.start();

    eventEmitter.on("update-enemy", async ({ enemy: enemyDto }) => {
      const enemy = new Enemy(enemyDto);
      // await enemy.start();
      this.players.set(enemy.getId(), enemy);
    });
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
}

new GameManager(new Game(), new Renderer()).start();
server.start();
