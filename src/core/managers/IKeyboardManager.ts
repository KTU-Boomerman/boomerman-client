export const USED_KEYS = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'KeyZ', 'KeyX', 'KeyC', 'KeyV'] as const;

export type Key = typeof USED_KEYS[number];

export type KeyState = 'pressed' | 'released';

export interface IKeyboardListener {
  onKey: (key: Key, state: KeyState) => void;
}

export interface IKeyboardManager {
  on(key: Key, listener: IKeyboardListener): void;
  off(key: Key, listener: IKeyboardListener): void;
  emit(key: string, state: KeyState): void;
  isPressed(key: Key): boolean;
  isReleased(key: Key): boolean;
  isUsedKey(key: string): boolean;
}
