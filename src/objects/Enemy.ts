import Position from "./Position";
import GameObject from "./GameObject";
import { Startable } from "../interfaces/Startable";
import { PlayerDTO } from "../core/dtos/PlayerDTO";

export default class Enemy extends GameObject implements Startable {
  private id: number = Number((Math.random() * 1000).toFixed(0));
  private position: Position = new Position(20, 20);
  private _name = "Player" + (Math.random() * 1000).toFixed(0);
  private image: ImageBitmap | null = null;

  constructor(playerDto: PlayerDTO) {
    super();
    this.id = playerDto.id;
    this._name = playerDto.name;
    this.position.x = playerDto.x;
    this.position.y = playerDto.y;
  }

  getId(): number {
    return this.id;
  }

  get name(): string {
    return this._name;
  }

  async start() {
    const result = await fetch("../../assets/player.png");
    const blob = await result.blob();
    this.image = await createImageBitmap(blob);
  }

  render(context: CanvasRenderingContext2D): void {
    console.log("Render enemy");
    context.fillStyle = "#00FF00";
    if (this.image) {
      context.drawImage(this.image, this.position.x, this.position.y);
    } else {
      context.fillRect(this.position.x, this.position.y, 32, 32);
    }
  }

  public toDto(): PlayerDTO {
    return {
      id: -1,
      name: this._name,
      x: this.position.x,
      y: this.position.y,
    };
  }
}
