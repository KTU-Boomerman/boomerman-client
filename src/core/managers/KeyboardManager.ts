import { IKeyboardListener, IKeyboardManager, Key, KeyState, USED_KEYS } from './IKeyboardManager';

export class KeyboardManager implements IKeyboardManager {
  private pressedKeys: Set<Key> = new Set();
  private _listeners: {
    [key in Key]: IKeyboardListener[];
  };

  constructor() {
    this._listeners = USED_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as { [key in Key]: IKeyboardListener[] },
    );
  }

  public on(key: Key, listener: IKeyboardListener): void {
    this._listeners[key].push(listener);
  }

  public off(key: Key, listener: IKeyboardListener): void {
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
    console.warn(`Key "${key}" is used.`);

    if (state === 'pressed') {
      this.pressedKeys.add(key);
    } else {
      this.pressedKeys.delete(key);
    }

    this._listeners[key].forEach((listener) => listener.onKey(key, state));
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

export const createKeyboardManager = () => {
  const keyboardManager = new KeyboardManager();

  document.addEventListener('keydown', (event) => {
    keyboardManager.emit(event.code, 'pressed');
  });
  document.addEventListener('keyup', (event) => {
    keyboardManager.emit(event.code, 'released');
  });

  return keyboardManager;
};
