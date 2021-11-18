import { singleton } from 'tsyringe';
import AnimatedSprite from './AnimatedSprite';
import Sprite from './Sprite';
import StaticSprite from './StaticSprite';

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
  frameDuration: number;
  playsOnce: boolean;
}

type SpriteData = StaticSpriteData | AnimatedSpriteData;

type SpriteKey =
  | 'player'
  | 'playerTransparent'
  | 'enemy'
  | 'enemyTransparent'
  | 'grass'
  | 'wall'
  | 'wood'
  | 'regularBomb'
  | 'destructibleWall'
  | 'bBombPowerup'
  | 'sBombPowerup'
  | 'bHealthPowerup'
  | 'sHealthPowerup'
  | 'bSpeedPowerup'
  | 'sSpeedPowerup'
  | 'waveBomb'
  | 'pulseBomb'
  | 'boomerangBomb'
  | 'explosion'
  | 'heart'
  | 'heartGrey';

export const sprites: Record<SpriteKey, SpriteData> = {
  player: {
    file: '../../assets/images/player.png',
  },
  playerTransparent: {
    file: '../../assets/images/playerTransparent.png',
  },
  enemy: {
    file: '../../assets/images/enemy.png',
  },
  enemyTransparent: {
    file: '../../assets/images/enemyTransparent.png',
  },
  grass: {
    file: '../../assets/images/grass.png',
  },
  wall: {
    file: '../../assets/images/wall.png',
  },
  wood: {
    file: '../../assets/images/wood.png',
  },
  regularBomb: {
    file: '../../assets/images/regularBomb.png',
  },
  destructibleWall: {
    file: '../../assets/images/destructibleWall.png',
  },
  bBombPowerup: {
    file: '../../assets/images/bBombPowerup.png',
  },
  sBombPowerup: {
    file: '../../assets/images/sBombPowerup.png',
  },
  bHealthPowerup: {
    file: '../../assets/images/bHealthPowerup.png',
  },
  sHealthPowerup: {
    file: '../../assets/images/sHealthPowerup.png',
  },
  bSpeedPowerup: {
    file: '../../assets/images/bSpeedPowerup.png',
  },
  sSpeedPowerup: {
    file: '../../assets/images/sSpeedPowerup.png',
  },
  waveBomb: {
    file: '../../assets/images/waveBomb.png',
  },
  pulseBomb: {
    file: '../../assets/images/pulseBomb.png',
  },
  boomerangBomb: {
    file: '../../assets/images/boomerangBomb.png',
  },
  explosion: {
    file: '../../assets/images/explosions.png',
    isAnimated: true,
    numColumns: 4,
    numRows: 4,
    frameHeight: 32,
    frameWidth: 32,
    frameDuration: 1000 / 16,
    playsOnce: true,
  },
  heart: {
    file: '../../assets/images/heart.png',
  },
  heartGrey: {
    file: '../../assets/images/heartGrey.png',
  },
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

    if (isAnimated) {
      const data = sprites[spriteKey] as AnimatedSpriteData;
      return new AnimatedSprite(image, data);
    }

    return new StaticSprite(image);
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
