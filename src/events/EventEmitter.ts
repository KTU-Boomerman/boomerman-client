import { EventMap } from "./EventMap";

export type EventListener<T> = (data: T) => void;

export class EventEmitter {
  private static instance: EventEmitter;
  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  private listeners: {
    [K in keyof EventMap]?: Array<EventListener<EventMap[K]>>;
  } = {};

  on<K extends keyof EventMap>(
    eventKey: K,
    listener: EventListener<EventMap[K]>
  ) {
    const hasListener = this.listeners[eventKey] != null;

    if (!hasListener) {
      this.listeners[eventKey] = [];
    }

    this.listeners[eventKey]!.push(listener);

    return {
      unsubscribe: () => {
        this.off(eventKey, listener);
      },
    };
  }

  off<K extends keyof EventMap>(
    eventKey: K,
    listenerToRemove: EventListener<EventMap[K]>
  ) {
    const hasListener = this.listeners[eventKey] != null;

    if (!hasListener) return;

    this.listeners[eventKey] = this.listeners[eventKey]!.filter(
      (listener) => listener !== listenerToRemove
    );
  }

  once<K extends keyof EventMap>(
    eventKey: K,
    listener: EventListener<EventMap[K]>
  ) {
    const tempListener = (data?: any) => {
      listener(data);
      this.off(eventKey, tempListener);
    };

    this.on(eventKey, tempListener);

    return {
      unsubscribe: () => {
        this.off(eventKey, tempListener);
      },
    };
  }

  removeAllListeners() {
    this.listeners = {};
  }

  emit<K extends keyof EventMap>(
    eventKey: K,
    ...data: EventMap[K] extends null | undefined ? [undefined?] : [EventMap[K]]
  ) {
    const hasListener = this.listeners[eventKey] != null;

    if (!hasListener) return;

    this.listeners[eventKey]!.forEach((callback) => {
      callback(data[0]!);
    });
  }
}
