export interface Startable {
  start(): Promise<void> | void;
}
