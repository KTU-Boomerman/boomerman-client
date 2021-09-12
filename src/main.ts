import "./style.css";

import Renderer from "./core/Renderer";
import AbstractGame from "./core/AbstractGame";
import GameManager from "./core/GameManager";
import Block from "./objects/Block";
import Position from "./objects/Position";
import Player from "./objects/Player";

import "./events/Keyboard";

class Game extends AbstractGame {
  block = new Block(new Position(20, 20));
  player = new Player(new Position(60, 20));

  public beginPlay(): void {}
  public tick(deltaTime: number): void {
    this.block.update(deltaTime);
    this.player.update(deltaTime);
  }
}

const gameManager = new GameManager(new Game(), new Renderer());
gameManager.start();
