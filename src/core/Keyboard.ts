const USED_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD'] as const;

export type Key = typeof USED_KEYS[number];

export class Keyboard {
  private static instance: Keyboard;
  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }
    return Keyboard.instance;
  }

  private constructor() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  private pressedKeys: Set<Key> = new Set();

  public isPressed(key: Key): boolean {
    return this.pressedKeys.has(key);
  }

  private onKeyDown(event: KeyboardEvent): void {
    const key = event.code as Key;
    if (USED_KEYS.includes(key)) this.pressedKeys.add(key);
  }

  private onKeyUp(event: KeyboardEvent): void {
    const key = event.code as Key;
    if (USED_KEYS.includes(key)) this.pressedKeys.delete(key);
  }
}
