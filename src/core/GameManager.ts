import { EventKeys, EventMap } from "../events/EventMap";
import { isStartable, Startable } from "../interfaces/Startable";
import GameObject from "../objects/GameObject";
import { getMethods } from "../utils/method";
import { Guard } from "../utils/types";
import Game from "./AbstractGame";
import { EventEmitter } from "./EventEmitter";
import { getListenedEventKeys } from "./Listen";
import Renderer from "./Renderer";
import Server from "./Server";

export default class GameManager {
  private last: number = 0;
  private deltaTime: number = 0;
  private game: Game;
  private renderer: Renderer;
  private server: Server;
  private eventEmitter: EventEmitter<EventKeys, EventMap>;

  constructor(
    game: Game,
    renderer: Renderer,
    server: Server,
    eventEmitter: EventEmitter<EventKeys, EventMap>
  ) {
    this.game = game;
    this.renderer = renderer;
    this.server = server;
    this.eventEmitter = eventEmitter;
  }

  public async start(): Promise<void> {
    this.game.start();

    for (const startable of this.getStartable()) {
      await startable.start();
    }

    const methods = getMethods(this.server);

    console.log(Reflect.getPrototypeOf(this.server));

    Object.keys(this.server).forEach((key) => {
      console.log(getListenedEventKeys(this.server, key));
    });
    console.log(getListenedEventKeys(this.server, "updatePosition"));

    const methodsWithListeners = [...this.getGameObjects(), this.server]
      .map((object) => {
        const keys = Object.keys(object);
        const getListened = (key: string) => getListenedEventKeys(object, key);
        return keys.map(getListened);
      })
      .flat();

    console.log(methodsWithListeners);

    requestAnimationFrame(this.loop.bind(this));
  }

  private updateTime(timestamp: number): void {
    if (!this.last) {
      this.last = timestamp;
    }
    this.deltaTime = timestamp - this.last;
    this.last = timestamp;
  }

  private loop(timestamp: number): void {
    this.renderer.render(this.getGameObjects());
    this.updateTime(timestamp);
    this.game.update(this.deltaTime);
    requestAnimationFrame(this.loop.bind(this));
  }

  private getArrayOf<T>(guard: Guard<T>): T[] {
    return Object.values(this.game).filter(guard);
  }

  private getStartable(): Startable[] {
    return this.getArrayOf<Startable>(isStartable);
  }

  private getGameObjects(): GameObject[] {
    return this.getArrayOf<GameObject>(
      (value): value is GameObject => value instanceof GameObject
    );
  }
}
