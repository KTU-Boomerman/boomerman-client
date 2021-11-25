import { singleton } from 'tsyringe';
import GameObject from '../../objects/GameObject';

@singleton()
export class EntityManager extends GameObject {
  private entities: GameObject[] = [];

  public add(entity: GameObject): void {
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
}
