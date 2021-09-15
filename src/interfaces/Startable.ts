export interface Startable {
  start(): Promise<void> | void;
}

export const isStartable = (startable: any): startable is Startable =>
  typeof startable.start === "function";
