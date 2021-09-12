export default abstract class AbstractGame {
  public abstract beginPlay(): void;
  public abstract tick(deltaTime: number): void;
}
