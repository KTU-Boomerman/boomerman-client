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

export const sprites: Record<string, SpriteData> = {
  player: {
    file: "../../assets/player.png",
  },
  bomb: {
    file: "../../assets/player.png",
  },
  repetitiveBomb: {
    file: "../../assets/player.png",
  },
  waveBomb: {
    file: "../../assets/player.png",
  },
} as const;

type SpriteKey = keyof typeof sprites;

// TODO: add logic for animated sprites
export default class SpriteFactory {
  private _sprites = new Map<SpriteKey, Sprite>();

  createSprite(spriteKey: SpriteKey): Sprite {
    if (this._sprites.has(spriteKey)) return this._sprites.get(spriteKey)!;

    const { file, isAnimated } = sprites[spriteKey];

    const sprite = isAnimated
      ? new AnimatedSprite(file)
      : new StaticSprite(file);

    this._sprites.set(spriteKey, sprite);

    return sprite;
  }
}
