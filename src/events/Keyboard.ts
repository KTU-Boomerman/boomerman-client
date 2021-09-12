const USED_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD"] as const;

export type Key = typeof USED_KEYS[number];

export class Keyboard {
  private static instance: Keyboard;
  private constructor() {}
  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }
    return Keyboard.instance;
  }

  private pressedKeys: Set<Key> = new Set();

  public isPressed(key: Key): boolean {
    return this.pressedKeys.has(key);
  }

  public onKeyDown(key: Key): void {
    this.pressedKeys.add(key);
  }

  public onKeyUp(key: Key): void {
    this.pressedKeys.delete(key);
  }
}

const emitKeyEvent = (pressed: boolean) => (event: KeyboardEvent) => {
  const code = event.code as Key;
  if (!USED_KEYS.includes(code)) return;

  if (pressed) Keyboard.getInstance().onKeyDown(code);
  else Keyboard.getInstance().onKeyUp(code);
};

document.addEventListener("keydown", emitKeyEvent(true));
document.addEventListener("keyup", emitKeyEvent(false));
