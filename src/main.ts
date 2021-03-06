import './style.css';
import 'toastify-js/src/toastify.css';
import 'reflect-metadata';

import { Renderer } from './core/Renderer';
import GameEngine from './core/managers/GameEngine';
import Server from './core/Server';
import SpriteFactory from './sprite/SpriteFactory';
import { container } from 'tsyringe';
import { createKeyboardManager } from './core/managers/KeyboardManager';
import { IKeyboardManager } from './core/managers/IKeyboardManager';
import { Game } from './core/Game';
import { showNotification } from './utils/notification';
import { EntityManager } from './core/managers/EntityManager';

const backgroundCanvas = document.getElementById('background') as HTMLCanvasElement;
const gameCanvas = document.getElementById('game') as HTMLCanvasElement;
const uiCanvas = document.getElementById('ui') as HTMLCanvasElement;

container.register('BackgroundRenderer', {
  useValue: new Renderer(backgroundCanvas),
});

container.register('GameRenderer', {
  useValue: new Renderer(gameCanvas),
});

container.register('UIRenderer', {
  useValue: new Renderer(uiCanvas, { alpha: true }),
});

container.register<IKeyboardManager>('IKeyboardManager', {
  useValue: createKeyboardManager(),
});

container.register<Server>('Server', {
  useValue: Server.getInstance(),
});

(async () => {
  const server = container.resolve<Server>('Server');
  const gameRenderer = container.resolve<Renderer>('GameRenderer');
  const spriteFactory = container.resolve(SpriteFactory);
  const keyboardManager = container.resolve<IKeyboardManager>('IKeyboardManager');

  await server.start();
  await spriteFactory.loadImages();

  server.on('Notification', showNotification);
  const game = container.resolve(Game);

  keyboardManager.on('KeyZ', game);
  keyboardManager.on('KeyX', game);
  keyboardManager.on('KeyC', game);
  keyboardManager.on('KeyV', game);
  keyboardManager.on('KeyB', game);
  keyboardManager.on('KeyA', game);

  const entityManager = container.resolve(EntityManager);
  gameRenderer.add(entityManager);

  await new GameEngine(game, gameRenderer).start();
})();
