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
    this.game.start();
    requestAnimationFrame(this.loop.bind(this));
  }

  private updateTime(timestamp: number): void {
    if (!this.last) {
      this.last = timestamp;
    }
    this.deltaTime = timestamp - this.last;
    this.last = timestamp;
  }

  private loop(timestamp: number): void {
    this.game.render(this.renderer);
    this.updateTime(timestamp);
    this.game.update(this.deltaTime);
    requestAnimationFrame(this.loop.bind(this));
  }
}
