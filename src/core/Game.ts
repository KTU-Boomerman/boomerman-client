import AbstractGame from './AbstractGame';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Position from '../objects/Position';
import { PlayerDTO } from '../dtos/PlayerDTO';
import Sprite from '../sprite/Sprite';
import { GameState } from '../objects/GameState';
import Bomb from '../objects/bombs/Bomb';
import { BombType } from '../objects/BombType';
import { inject, singleton } from 'tsyringe';
import { IKeyboardListener, IKeyboardManager, Key, KeyState } from './managers/IKeyboardManager';
import Server from './Server';
import { Renderer } from './Renderer';
import SpriteFactory from '../sprite/SpriteFactory';
import { PositionDTO } from '../dtos/PositionDTO';
import { Explosion } from '../objects/Explosion';
import { BombFactory } from '../objects/bombs/BombFactory';
import { MapDTO } from '../dtos/MapDTO';
import WallBuilder from '../objects/walls/WallBuilder';
import Wall from '../objects/walls/Wall';
import { UIManager } from './managers/UIManager';
import AnimatedSprite from '../sprite/AnimatedSprite';
import Powerup from '../objects/powerups/Powerup';
import { PowerupFactory } from '../objects/powerups/PowerupFactory';
import { Effect } from '../effects/Effect';
import { Sounds } from './managers/SoundManager';
import { SoundEffect } from '../effects/SoundEffect';
import { NullEffect } from '../effects/NullEffect';
import { GrayscaleDecorator } from '../effects/GrayscaleDecorator';
import { ShakeDecorator } from '../effects/ShakeDecorator';

@singleton()
export class Game extends AbstractGame implements IKeyboardListener {
  player: Player;
  enemies: Map<string, Enemy>;
  bombs: Bomb[];
  explosions: Explosion[] = [];
  walls: Wall[] = [];
  powerups: Powerup[] = [];
  gameState: GameState;

  playerSprite: Sprite;
  playerDyingSprite: Sprite;
  enemySprite: Sprite;
  enemyDyingSprite: Sprite;
  explosionSprite: AnimatedSprite;

  deathEffect: Effect;

  constructor(
    @inject('IKeyboardManager') private keyboardManager: IKeyboardManager,
    @inject('Server') private server: Server,
    @inject('GameRenderer') private gameRenderer: Renderer,
    @inject('BackgroundRenderer') private backgroundRenderer: Renderer,
    @inject(SpriteFactory) public spriteFactory: SpriteFactory,
    @inject(BombFactory) public bombFactory: BombFactory,
    @inject(PowerupFactory) public powerupFactory: PowerupFactory,
    @inject(UIManager) private uiManager: UIManager,
  ) {
    super();

    this.playerSprite = this.spriteFactory.createSprite('player');
    this.playerDyingSprite = this.spriteFactory.createSprite('playerTransparent');
    this.enemySprite = this.spriteFactory.createSprite('enemy');
    this.enemyDyingSprite = this.spriteFactory.createSprite('enemyTransparent');

    this.explosionSprite = this.spriteFactory.createSprite('explosion') as AnimatedSprite;

    this.gameState = GameState.PlayersJoining;

    this.enemies = new Map();
    this.bombs = [];

    this.player = new Player(this.playerSprite, this.playerDyingSprite, Position.create(0, 0), this);

    this.player.keyboardManager = this.keyboardManager;

    this.uiManager.render();

    this.deathEffect = this.createEffect({
      sound: 'death',
      visual: 'grayscale',
      animation: 'shake',
    });
  }

  async start(): Promise<void> {
    this.mapEvents();
  }

  update(deltaTime: number): void {
    if (this.gameState == GameState.GameInProgress) this.player.update(deltaTime);

    for (const player of this.enemies.values()) {
      player.update(deltaTime);
    }

    for (const explosion of this.explosions) {
      explosion.update(deltaTime);
    }

    this.explosions = this.explosions.filter((e) => !e.isFinished);

    const newExplosions = [];
    for (const explosion of this.explosions) {
      if (!explosion.isFinished) {
        newExplosions.push(explosion);
      } else {
        this.gameRenderer.remove(explosion);
      }
    }

    this.explosions = newExplosions;
  }

  private mapEvents() {
    this.server.invoke('PlayerJoin');

    this.server.on('Joined', async (playerDto, playersDto, gameStateDto, mapDto) => {
      this.loadPlayer(playerDto);
      this.loadEnemies(playersDto);
      this.loadMap(mapDto);
      this.gameState = gameStateDto.gameState;
    });

    this.server.on('GameStateChanged', (gameStateDto) => {
      this.gameState = gameStateDto.gameState;
    });

    this.server.on('PlayerJoin', async (playerDto) => {
      this.loadEnemy(playerDto);
    });

    this.server.on('PlayerLeave', (playerId) => {
      const enemy = this.enemies.get(playerId);
      if (enemy) this.gameRenderer.remove(enemy);

      this.enemies.delete(playerId);
    });

    this.server.on('PlayerMove', (playerId, position) => {
      const player = this.enemies.get(playerId);
      if (!player) return;

      player.position = new Position(position);
      this.enemies.set(playerId, player);
    });

    this.server.on('PlayerPlaceBomb', (bombDto) => {
      const position = new Position(bombDto.position);
      const bomb = this.bombFactory.createBomb(position, bombDto.bombType);

      this.bombs.push(bomb);
      this.gameRenderer.add(bomb);
    });

    this.server.on('Explosions', (positionsDto) => {
      positionsDto.forEach((dto) => {
        const position = new Position(dto);
        // remove bomb
        const bomb = this.bombs.find((b) => b.position.equals(position));

        if (bomb) {
          this.bombs = this.bombs.filter((b) => b != bomb);
          this.gameRenderer.remove(bomb);
        }

        this.removePowerup(new Position(position));

        // add explosion
        const explosion = new Explosion(this.explosionSprite.clone(), position);
        this.gameRenderer.add(explosion);
        this.explosions.push(explosion);

        // break wall
        const wall = this.walls.find((w) => w.position.equals(position));
        if (wall) this.gameRenderer.remove(wall);
      });
    });

    this.server.on('UpdateLives', (playerId, lives) => {
      if (playerId == this.player.id) {
        this.player.lives = lives;
        this.uiManager.updateLives(lives);

        if (lives <= 0) this.deathEffect.play();
      }

      const enemy = this.enemies.get(playerId);
      if (enemy) enemy.lives = lives;
    });

    this.server.on('UpdateScore', (playerId, score) => {
      if (playerId == this.player.id) this.uiManager.updateScore(score);
    });

    this.server.on('UpdateBombCount', (playerId, count) => {
      if (playerId == this.player.id) this.uiManager.updateBombCount(count);
    });

    this.server.on('PlacePowerup', (powerupDto) => {
      const position = new Position(powerupDto.position);
      const powerup = this.powerupFactory.createBomb(position, powerupDto.powerupType);

      this.powerups.push(powerup);
      this.gameRenderer.add(powerup);
    });

    this.server.on('RemovePowerup', (positionDto) => {
      this.removePowerup(new Position(positionDto));
    });
  }

  async onPlayerPositionUpdate(position: PositionDTO, newPosition: PositionDTO) {
    const currentPosition = await this.server.invoke('PlayerMove', position, newPosition);

    this.player.position = new Position(currentPosition);
  }

  onKey(key: Key, state: KeyState): void {
    if (state == 'pressed') {
      switch (key) {
        case 'KeyZ':
          this.addBomb();
          break;
        case 'KeyX':
          this.addBomb(BombType.Boomerang);
          break;
        case 'KeyC':
          this.addBomb(BombType.Wave);
          break;
        case 'KeyV':
          this.addBomb(BombType.Pulse);
          break;
        default:
          break;
      }
    }
  }

  private addBomb(bombType: BombType = BombType.Regular) {
    this.server.invoke('PlaceBomb', { bombType });
  }

  private loadEnemies(players: PlayerDTO[]) {
    for (const player of players) {
      this.loadEnemy(player);
    }
  }

  private loadEnemy(player: PlayerDTO) {
    const enemy = new Enemy(this.enemySprite, this.enemyDyingSprite, player);
    this.enemies.set(enemy.id, enemy);

    this.gameRenderer.add(enemy);
  }

  private loadPlayer(playerDto: PlayerDTO) {
    const postion = new Position(playerDto.position);
    this.player.id = playerDto.id;
    this.player.position = postion;

    this.gameRenderer.add(this.player);
  }

  private loadMap(mapDto: MapDTO) {
    const destructibleWallBuilder = new WallBuilder()
      .setSprite(this.spriteFactory.createSprite('destructibleWall'))
      .setIsDestructible(true);

    mapDto.walls.forEach((wPos) => {
      const wall = destructibleWallBuilder.setPosition(new Position(wPos)).build();
      this.walls.push(wall);
      this.gameRenderer.add(wall);
    });
  }

  private removePowerup(position: Position) {
    const powerup = this.powerups.find((p) => p.position.equals(position));
    if (powerup) {
      this.powerups = this.powerups.filter((p) => p != powerup);
      this.gameRenderer.remove(powerup);
    }
  }

  private createEffect({
    sound,
    visual,
    animation,
  }: {
    sound?: Sounds;
    visual?: 'grayscale';
    animation?: 'shake';
  }): Effect {
    let effect = sound ? new SoundEffect(sound) : new NullEffect();

    if (visual === 'grayscale') {
      effect = new GrayscaleDecorator(effect, [this.gameRenderer, this.backgroundRenderer]);
    }

    if (animation === 'shake') effect = new ShakeDecorator(effect);

    return effect;
  }
}
