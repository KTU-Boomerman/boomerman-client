import { inject, singleton } from "tsyringe";
import Position from "../../objects/Position";
import Sprite from "../../sprite/Sprite";
import SpriteFactory from "../../sprite/SpriteFactory";
import { Heart } from "../../ui/Heart";
import { Renderer } from "../Renderer";

export type Lives = 0 | 1 | 2 | 3;

@singleton()
export class UIManager {
  private hearts: [Heart, Heart, Heart];

  private heartSprite: Sprite;
  private heartGreySprite: Sprite;

  constructor(
    @inject(SpriteFactory) private spriteFactory: SpriteFactory,
    @inject("UIRenderer") private renderer: Renderer
  ) {
    this.heartSprite = this.spriteFactory.createSprite("heart");
    this.heartGreySprite = this.spriteFactory.createSprite("heartGrey");

    this.hearts = [
      new Heart(Position.create(8, 8), this.heartSprite),
      new Heart(Position.create(40, 8), this.heartSprite),
      new Heart(Position.create(72, 8), this.heartSprite),
    ];

    for (const heart of this.hearts) {
      this.renderer.add(heart);
    }

    this.render();
  }

  updateLives(lives: Lives) {
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].sprite =
        i < lives ? this.heartSprite : this.heartGreySprite;
    }

    this.render();
  }

  render() {
    this.renderer.render();
  }
}
