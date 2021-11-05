import { singleton } from "tsyringe";
import AnimatedSprite from "./AnimatedSprite";
import Sprite from "./Sprite";
import StaticSprite from "./StaticSprite";

interface StaticSpriteData {
  file: string;
  isAnimated?: boolean;
}

interface AnimatedSpriteData extends StaticSpriteData {
  isAnimated: true;
  numColumns: number;
  numRows: number;
  frameWidth: number;
  frameHeight: number;
}

type SpriteData = StaticSpriteData | AnimatedSpriteData;

type SpriteKey = "player" | "grass" | "wall" | "wood" | "regularBomb" | "destructibleWall" | "bBombPowerup" | "sBombPowerup" |
    "bHealthPowerup" | "sHealthPowerup" | "bSpeedPowerup" | "sSpeedPowerup" | "waveBomb" | "pulseBomb" | "boomerangBomb" | "explosion";

export const sprites: Record<SpriteKey, SpriteData> = {
  player: {
    file: "../../assets/images/player.png",
  },
  grass: {
    file: "../../assets/images/grass.png",
  },
  wall: {
    file: "../../assets/images/wall.png",
  },
  wood: {
    file: "../../assets/images/wood.png",
  },
  regularBomb: {
    file: "../../assets/images/regularBomb.png",
  },
  destructibleWall: {
    file: "../../assets/images/destructibleWall.png",
  },
  bBombPowerup: {
    file: "../../assets/images/bBombPowerup.png",
  },
  sBombPowerup: {
    file: "../../assets/images/sBombPowerup.png",
  },
  bHealthPowerup: {
    file: "../../assets/images/bHealthPowerup.png",
  },
  sHealthPowerup: {
    file: "../../assets/images/sHealthPowerup.png",
  },
  bSpeedPowerup: {
    file: "../../assets/images/bSpeedPowerup.png",
  },
  sSpeedPowerup: {
    file: "../../assets/images/sSpeedPowerup.png",
  },
  waveBomb: {
    file: "../../assets/images/waveBomb.png",
  },
  pulseBomb: {
    file: "../../assets/images/pulseBomb.png",
  },
  boomerangBomb: {
    file: "../../assets/images/boomerangBomb.png",
  },
  explosion: {
    file: "../../assets/images/explosion.png",
  }
};

// TODO: add logic for animated sprites
@singleton()
export default class SpriteFactory {
  private _images = new Map<string, ImageBitmap>();

  createSprite(spriteKey: SpriteKey): Sprite {
    const image = this._images.get(spriteKey);

    if (!image) {
      throw new Error(`Image not found for key: ${spriteKey}`);
    }

    const { isAnimated } = sprites[spriteKey];

    const sprite = isAnimated
      ? new AnimatedSprite(image)
      : new StaticSprite(image);

    return sprite;
  }

  async loadImages(): Promise<void> {
    for (const [key, { file }] of Object.entries(sprites)) {
      const image = await this.loadImage(file);
      this._images.set(key, image);
    }
  }

  private async loadImage(filePath: string): Promise<ImageBitmap> {
    const result = await fetch(filePath);
    const blob = await result.blob();
    return await createImageBitmap(blob);
  }
}
