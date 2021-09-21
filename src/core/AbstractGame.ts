export default abstract class AbstractGame {
  public abstract start(): void;
  public abstract update(deltaTime: number): void;
}
