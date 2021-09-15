import { isStartable, Startable } from "../interfaces/Startable";
import GameObject from "../objects/GameObject";
import Game from "./AbstractGame";
import Renderer from "./Renderer";

export default class GameManager {
  private last: number = 0;
  private deltaTime: number = 0;
  private game: Game;
  private renderer: Renderer;

  constructor(game: Game, renderer: Renderer) {
    this.game = game;
    this.renderer = renderer;
  }

  public async start(): Promise<void> {
    this.game.beginPlay();

    for (const startable of this.getStartables()) {
      await startable.start();
    }

    requestAnimationFrame(this.loop.bind(this));
  }

  public update(callback: (timestamp: number) => void): void {
    callback(this.deltaTime);
  }

  private getStartables(): Startable[] {
    const keys = Object.keys(this.game);

    const gameWithComponents = this.game as unknown as {
      [key: string]: Startable;
    };

    return keys
      .filter((key) => isStartable(gameWithComponents[key]))
      .map((key) => gameWithComponents[key]);
  }

  private getEntities(): GameObject[] {
    const keys = Object.keys(this.game);

    const gameWithGameObjects = this.game as unknown as {
      [key: string]: GameObject;
    };

    return keys
      .filter((key) => gameWithGameObjects[key] instanceof GameObject)
      .map((key) => gameWithGameObjects[key]);
  }

  private updateTime(timestamp: number): void {
    if (!this.last) {
      this.last = timestamp;
    }
    this.deltaTime = timestamp - this.last;
    this.last = timestamp;
  }

  private loop(timestamp: number): void {
    this.renderer.render(this.getEntities());
    this.updateTime(timestamp);
    this.game.tick(this.deltaTime);
    requestAnimationFrame(this.loop.bind(this));
  }
}
