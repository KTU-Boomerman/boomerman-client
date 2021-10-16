export const USED_KEYS = [
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "KeyZ",
  "KeyX",
  "KeyC",
] as const;

export type Key = typeof USED_KEYS[number];

export type KeyState = "pressed" | "released";

export type KeyListener = (state: KeyState) => void;

export interface IKeyboardManager {
  on(key: Key, listener: KeyListener): void;
  off(key: Key, listener: KeyListener): void;
  emit(key: string, state: KeyState): void;
  isPressed(key: Key): boolean;
  isReleased(key: Key): boolean;
  isUsedKey(key: string): boolean;
}
