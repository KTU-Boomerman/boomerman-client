import {
  IKeyboardManager,
  Key,
  KeyListener,
  KeyState,
  USED_KEYS,
} from "./IKeyboardManager";

export class KeyboardManager implements IKeyboardManager {
  private pressedKeys: Set<Key> = new Set();
  private _listeners: {
    [key in Key]: KeyListener[];
  };

  constructor() {
    this._listeners = USED_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as { [key in Key]: KeyListener[] }
    );
  }

  public on(key: Key, listener: KeyListener): void {
    this._listeners[key].push(listener);
  }

  public off(key: Key, listener: KeyListener): void {
    const listeners = this._listeners[key];
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  public emit(key: string, state: KeyState): void {
    if (!this.isUsedKey(key)) {
      return;
    }

    if (state === "pressed") {
      this.pressedKeys.add(key);
    } else {
      this.pressedKeys.delete(key);
    }

    const listeners = this._listeners[key];
    listeners.forEach((listener) => listener(state));
  }

  public isPressed(key: Key): boolean {
    return this.pressedKeys.has(key);
  }

  public isReleased(key: Key): boolean {
    return !this.isPressed(key);
  }

  public isUsedKey(key: string): key is Key {
    return USED_KEYS.includes(key as Key);
  }
}
