import { soundManager, Sounds } from "../core/managers/SoundManager";
import { Effect } from "./Effect";

export class SoundEffect implements Effect {
    private _sound: Sounds;

    constructor(sound: Sounds) {
        this._sound = sound;
    }

    play(): void {
        soundManager.playSound(this._sound);
    }
}