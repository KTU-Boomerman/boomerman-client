export default abstract class AbstractGame {
  public abstract start(): Promise<void>;
  public abstract update(deltaTime: number): void;
}
