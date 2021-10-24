import "./style.css";
import "reflect-metadata";

import Renderer from "./core/Renderer";
import GameManager from "./core/managers/GameManager";
import Server from "./core/Server";
import SpriteFactory from "./sprite/SpriteFactory";
import { BackgroundManager } from "./core/managers/BackgroundManager";
import { container } from "tsyringe";
import { createKeyboardManager } from "./core/managers/KeyboardManager";
import { IKeyboardManager } from "./core/managers/IKeyboardManager";
import { Game } from "./core/Game";

const backgroundCanvas = document.getElementById(
  "background"
) as HTMLCanvasElement;
const gameCanvas = document.getElementById("game") as HTMLCanvasElement;

container.register("BackgroundRenderer", {
  useValue: new Renderer(backgroundCanvas),
});

container.register("GameRenderer", {
  useValue: new Renderer(gameCanvas),
});

container.register<IKeyboardManager>("IKeyboardManager", {
  useValue: createKeyboardManager(),
});

container.register<Server>("Server", {
  useValue: Server.getInstance(),
});

(async () => {
  const server = container.resolve<Server>("Server");
  const gameRenderer = container.resolve<Renderer>("GameRenderer");
  const spriteFactory = container.resolve(SpriteFactory);
  const backgroundManager = container.resolve(BackgroundManager);

  await server.start();
  await spriteFactory.loadImages();

  const game = container.resolve(Game);

  backgroundManager.buildBackground();
  backgroundManager.render();

  await new GameManager(game, gameRenderer).start();
})();
