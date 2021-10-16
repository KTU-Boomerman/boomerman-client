import defaultMap from "../../../assets/maps/default";
import GameObject from "../../objects/GameObject";
import Position from "../../objects/Position";
import WallBuilder from "../../objects/walls/WallBuilder";
import SpriteFactory from "../../sprite/SpriteFactory";
import Renderer from "../Renderer";
import { IBackgroundManager } from "./IBackgroundManager";

export class BackgroundManager implements IBackgroundManager {
  private map: GameObject[][] = [];

  constructor(
    private spriteFactory: SpriteFactory,
    private renderer: Renderer
  ) {}

  buildBackground(map: string[][] = defaultMap) {
    this.renderer.removeAll();

    const wallBuilder = new WallBuilder().setSprite(
      this.spriteFactory.createSprite("wall")
    );
    const grassBuilder = new WallBuilder().setSprite(
      this.spriteFactory.createSprite("grass")
    );

    for (let y = 0; y < map.length; y++) {
      const row = map[y];
      this.map[y] = [];

      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        const position = Position.create(x * 32, y * 32);

        if (cell === "w") {
          this.map[y][x] = wallBuilder.setPosition(position).build();
        } else {
          this.map[y][x] = grassBuilder.setPosition(position).build();
        }

        this.renderer.add(this.map[y][x]);
      }
    }
  }

  render() {
    this.renderer.render();
  }
}
