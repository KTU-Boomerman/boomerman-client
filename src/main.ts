import "./style.css";
import "reflect-metadata";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/GameManager";
import Block from "./objects/Block";
import Position from "./objects/Position";
import Player from "./objects/Player";
import Server from "./core/Server";
import { createEventEmitter } from "./core/EventEmitter";

class Game extends AbstractGame {
  block = new Block(new Position(20, 20));
  player = new Player(new Position(60, 20));

  public start(): void {}
  public update(deltaTime: number): void {
    this.block.update(deltaTime);
    this.player.update(deltaTime);
  }
}

new GameManager(
  new Game(),
  new Renderer(),
  new Server(),
  createEventEmitter()
).start();
