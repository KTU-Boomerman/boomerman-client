import { inject, singleton } from 'tsyringe';
import { PlayerDTO } from '../../dtos/PlayerDTO';
import Bomb from '../../objects/bombs/Bomb';
import Enemy from '../../objects/Enemy';
import { Explosion } from '../../objects/Explosion';
import GameObject from '../../objects/GameObject';
import Player from '../../objects/Player';
import Position from '../../objects/Position';
import Powerup from '../../objects/powerups/Powerup';
import Wall from '../../objects/walls/Wall';
import AnimatedSprite from '../../sprite/AnimatedSprite';
import Sprite from '../../sprite/Sprite';
import SpriteFactory from '../../sprite/SpriteFactory';
import { IManager } from '../../interfaces/IManager';
import { IVisitor } from '../../interfaces/IVisitor';
import { UIManager } from './UIManager';

@singleton()
export class EntityManager extends GameObject implements IManager {
  private _placedBombCount = 0;
  private entities: GameObject[] = [];

  private enemySprite: Sprite;
  private enemyDyingSprite: Sprite;
  private explosionSprite: AnimatedSprite;

  constructor(@inject(SpriteFactory) private spriteFactory: SpriteFactory, @inject(UIManager) uiManager: UIManager) {
    super();

    this.add(uiManager);

    this.enemySprite = this.spriteFactory.createSprite('enemy');
    this.enemyDyingSprite = this.spriteFactory.createSprite('enemyTransparent');

    this.explosionSprite = this.spriteFactory.createSprite('explosion') as AnimatedSprite;
  }

  public getPlacedBombCount(): number {
    return this._placedBombCount;
  }

  public accept(v: IVisitor) {
    return v.visitEntityManager(this);
  }

  public add(entity: GameObject): void {
    if (entity instanceof Bomb) {
      this._placedBombCount++;
    }

    this.entities.push(entity);
  }

  public remove(entity: GameObject): void {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  public start(): void {
    this.entities.forEach((entity) => {
      entity.start();
    });
  }

  public update(delta: number): void {
    this.entities.forEach((entity) => {
      entity.update(delta);
    });
  }

  public render(context: CanvasRenderingContext2D): void {
    this.entities.forEach((entity) => {
      entity.render(context);
    });
  }

  public removeFinishedExplosions(): void {
    this.entities = this.entities.filter((entity) => {
      if (entity instanceof Explosion) {
        const explosion = entity as Explosion;
        return !explosion.isFinished;
      }

      return true;
    });
  }

  public removeBombByPosition(position: Position): void {
    this.entities = this.entities.filter((entity) => {
      if (entity instanceof Bomb) {
        const bomb = entity as Bomb;
        return !bomb.position.equals(position);
      }

      return true;
    });
  }

  public getPlayerById(id: string): Player | Enemy | null {
    for (const entity of this.entities) {
      if (entity instanceof Player && entity.id === id) {
        return entity as Player;
      }

      if (entity instanceof Enemy && entity.id === id) {
        return entity as Enemy;
      }
    }

    return null;
  }

  public removeWallByPosition(position: Position): void {
    this.entities = this.entities.filter((entity) => {
      if (entity instanceof Wall) {
        const wall = entity as Wall;
        return !wall.position.equals(position);
      }

      return true;
    });
  }

  public removePowerupByPosition(position: Position): void {
    this.entities = this.entities.filter((entity) => {
      if (entity instanceof Powerup) {
        const powerup = entity as Powerup;
        return !powerup.position.equals(position);
      }

      return true;
    });
  }

  public getPlayer(): Player | null {
    for (const entity of this.entities) {
      if (entity instanceof Player) {
        return entity as Player;
      }
    }

    return null;
  }

  public isCurrentPlayer(playerId: string): boolean {
    const player = this.getPlayer();
    return player != null && player.id === playerId;
  }

  public addEnemy(enemyDto: PlayerDTO): Enemy {
    const enemy = new Enemy(this.enemySprite, this.enemyDyingSprite, enemyDto);

    this.add(enemy);

    return enemy;
  }

  public addExplosion(position: Position): Explosion {
    const explosion = new Explosion(this.explosionSprite.clone(), position);

    this.add(explosion);
    return explosion;
  }
}
