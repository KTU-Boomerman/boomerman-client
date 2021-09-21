import { EventKeys, EventMap } from "../events/EventMap";

export type EventListener<T> = (data: T) => void;

export const createEventEmitter = (): EventEmitter<EventKeys, EventMap> => {
  return new EventEmitter<EventKeys, EventMap>();
};

export class EventEmitter<
  TKeys extends string,
  TEventMap extends { [k in `${TKeys}`]: any }
> {
  private listeners: {
    [K in keyof TEventMap]?: Array<EventListener<TEventMap[K]>>;
  } = {};

  on<K extends keyof TEventMap>(
    eventKey: K,
    listener: EventListener<TEventMap[K]>
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

  off<K extends keyof TEventMap>(
    eventKey: K,
    listenerToRemove: EventListener<TEventMap[K]>
  ) {
    const hasListener = this.listeners[eventKey] != null;

    if (!hasListener) return;

    this.listeners[eventKey] = this.listeners[eventKey]!.filter(
      (listener) => listener !== listenerToRemove
    );
  }

  once<K extends keyof TEventMap>(
    eventKey: K,
    listener: EventListener<TEventMap[K]>
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

  emit<K extends keyof TEventMap>(
    eventKey: K,
    ...data: TEventMap[K] extends null | undefined
      ? [undefined?]
      : [TEventMap[K]]
  ) {
    const hasListener = this.listeners[eventKey] != null;

    if (!hasListener) return;

    this.listeners[eventKey]!.forEach((callback) => {
      callback(data[0]!);
    });
  }
}
