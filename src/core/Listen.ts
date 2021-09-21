import { EventKeys } from "../events/EventMap";

export const LISTEN_KEY = Symbol("listen");

export function Listen(eventKeys: EventKeys | EventKeys[]) {
  return Reflect.metadata(LISTEN_KEY, eventKeys);
}
export function getListenedEventKeys(target: any, propertyKey: string) {
  return Reflect.getMetadata(LISTEN_KEY, target, propertyKey);
}

export const getMethods = (object: any) => {
  const prototype = Reflect.getPrototypeOf(object);

  if (prototype) {
    return Object.values(prototype);
  }

  return [];
};
