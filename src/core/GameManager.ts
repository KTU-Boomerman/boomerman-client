import Stats from "stats.js";
import Game from "./AbstractGame";
import Renderer from "./Renderer";

// TODO: add only in development mode
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

export default class GameManager {
  private last: number = 0;
  private deltaTime: number = 0;
  private game: Game;
  private renderer: Renderer;
  private isLoading = true;

  constructor(game: Game, renderer: Renderer) {
    this.game = game;
    this.renderer = renderer;
  }

  public async start(): Promise<void> {
    await this.game.start();
    this.isLoading = false;
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
    if (this.isLoading) return;
    stats.begin();

    this.game.render(this.renderer);
    this.updateTime(timestamp);
    this.game.update(this.deltaTime);

    stats.end();
    requestAnimationFrame(this.loop.bind(this));
  }
}
