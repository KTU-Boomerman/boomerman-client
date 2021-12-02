import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Position from '../objects/Position';
import { PlayerDTO } from '../dtos/PlayerDTO';
import Sprite from '../sprite/Sprite';
import { GameState } from '../objects/GameState';
import { BombType } from '../objects/BombType';
import { inject, singleton } from 'tsyringe';
import { IKeyboardListener, IKeyboardManager, Key, KeyState } from './managers/IKeyboardManager';
import Server from './Server';
import SpriteFactory from '../sprite/SpriteFactory';
import { PositionDTO } from '../dtos/PositionDTO';
import { BombFactory } from '../objects/bombs/BombFactory';
import { MapDTO } from '../dtos/MapDTO';
import WallBuilder from '../objects/walls/WallBuilder';
import { UIManager } from './managers/UIManager';
import AnimatedSprite from '../sprite/AnimatedSprite';
import { PowerupFactory } from '../objects/powerups/PowerupFactory';
import { EntityManager } from './managers/EntityManager';
import GameObject from '../objects/GameObject';
import { BackgroundManager } from './managers/BackgroundManager';
import { NetworkManager } from './managers/NetworkManager';
import { AudioManager } from './managers/AudioManager';

@singleton()
export class Game extends GameObject implements IKeyboardListener {
  player: Player;
  gameState: GameState;

  playerSprite: Sprite;
  playerDyingSprite: Sprite;
  enemySprite: Sprite;
  enemyDyingSprite: Sprite;
  explosionSprite: AnimatedSprite;

  constructor(
    @inject('IKeyboardManager') private keyboardManager: IKeyboardManager,
    @inject('Server') private server: Server,
    @inject(SpriteFactory) public spriteFactory: SpriteFactory,
    @inject(BombFactory) public bombFactory: BombFactory,
    @inject(PowerupFactory) public powerupFactory: PowerupFactory,
    @inject(UIManager) private uiManager: UIManager,
    @inject(EntityManager) private entityManager: EntityManager,
    @inject(BackgroundManager) private backgroundManager: BackgroundManager,
    @inject(NetworkManager) private networkManager: NetworkManager,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {
    super();

    this.playerSprite = this.spriteFactory.createSprite('player');
    this.playerDyingSprite = this.spriteFactory.createSprite('playerTransparent');
    this.enemySprite = this.spriteFactory.createSprite('enemy');
    this.enemyDyingSprite = this.spriteFactory.createSprite('enemyTransparent');

    this.explosionSprite = this.spriteFactory.createSprite('explosion') as AnimatedSprite;

    this.gameState = GameState.PlayersJoining;

    this.player = new Player(this.playerSprite, this.playerDyingSprite, Position.create(0, 0), this);
    this.player.keyboardManager = this.keyboardManager;
    this.entityManager.add(this.player);

    this.backgroundManager.buildBackground();
  }

  async start(): Promise<void> {
    this.mapEvents();
    this.networkManager.start();
    this.uiManager.start();
    this.backgroundManager.start();
    await this.audioManager.init();
  }

  update(deltaTime: number): void {
    this.entityManager.removeFinishedExplosions();

    if (this.gameState == GameState.GameInProgress) {
      this.entityManager.update(deltaTime);
    }
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
        case 'KeyB':
          this.server.invoke('ChangePlayerColor');
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
    this.entityManager.add(enemy);
  }

  private loadPlayer(playerDto: PlayerDTO) {
    const postion = new Position(playerDto.position);
    this.player.id = playerDto.id;
    this.player.position = postion;
  }

  private loadMap(mapDto: MapDTO) {
    const destructibleWallBuilder = new WallBuilder()
      .setSprite(this.spriteFactory.createSprite('destructibleWall'))
      .setIsDestructible(true);

    mapDto.walls.forEach((wPos) => {
      const wall = destructibleWallBuilder.setPosition(new Position(wPos)).build();
      this.entityManager.add(wall);
    });
  }
}
