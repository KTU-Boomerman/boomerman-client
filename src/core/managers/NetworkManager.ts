import { singleton, inject } from 'tsyringe';
import { PlayerDTO } from '../../dtos/PlayerDTO';
import { BombFactory } from '../../objects/bombs/BombFactory';
import GameObject from '../../objects/GameObject';
import Position from '../../objects/Position';
import { PowerupFactory } from '../../objects/powerups/PowerupFactory';
import Server from '../Server';
import { AudioManager } from './AudioManager';
import { EffectManager } from './EffectManager';
import { EntityManager } from './EntityManager';
import { Lives, UIManager } from './UIManager';
import { ChatManager } from './ChatManager';
import { Effect } from '../../effects/Effect';
import { IManager } from '../../interfaces/IManager';
import { IVisitor } from '../../interfaces/IVisitor';
import { StatsVisitor } from '../managers/StatsVisitor';

@singleton()
export class NetworkManager extends GameObject implements IManager {
  private _effectsCount = 0;
  private _aliveEffect: Effect;
  private _injuredEffect: Effect;
  private _heavyInjuryEffect: Effect;
  private _deathEffect: Effect;

  private _effects: Record<Lives, Effect>;

  private _currentEffect: Effect;
  private visitableManagers: IManager[] = [];

  constructor(
    @inject('Server') private server: Server,
    @inject(BombFactory) private bombFactory: BombFactory,
    @inject(PowerupFactory) private powerupFactory: PowerupFactory,
    @inject(EffectManager) private effectManager: EffectManager,
    @inject(UIManager) private uiManager: UIManager,
    @inject(EntityManager) private entityManager: EntityManager,
    @inject(AudioManager) private audioManager: AudioManager,
    @inject(ChatManager) private chatManager: ChatManager,
  ) {
    super();
    this.visitableManagers.push(chatManager, entityManager, this);

    this._aliveEffect = this.effectManager.createEffect();

    this._injuredEffect = this.effectManager.createEffect({
      visual: ['grayscale', 33],
    });

    this._heavyInjuryEffect = this.effectManager.createEffect({
      visual: ['grayscale', 66],
    });

    this._deathEffect = this.effectManager.createEffect({
      sound: 'death',
      visual: ['grayscale', 100],
      animation: 'shake',
    });

    this._effects = {
      3: this._aliveEffect,
      2: this._injuredEffect,
      1: this._heavyInjuryEffect,
      0: this._deathEffect,
    };

    this._currentEffect = this._aliveEffect;
  }

  public getEffectsCount(): number {
    return this._effectsCount;
  }

  public accept(v: IVisitor) {
    return v.visitNetworkManager(this);
  }

  private loadEnemies(players: PlayerDTO[]) {
    for (const player of players) {
      this.entityManager.addEnemy(player);
    }
  }

  private loadPlayer(playerDto: PlayerDTO) {
    const player = this.entityManager.getPlayer();
    if (!player) return;

    const position = new Position(playerDto.position);

    player.id = playerDto.id;
    player.position = position;
  }

  // private loadMap(mapDto: MapDTO) {
  //   const destructibleWallBuilder = new WallBuilder()
  //     .setSprite(this.spriteFactory.createSprite('destructibleWall'))
  //     .setIsDestructible(true);

  //   mapDto.walls.forEach((wPos) => {
  //     const wall = destructibleWallBuilder.setPosition(new Position(wPos)).build();
  //     this.entityManager.add(wall);
  //   });
  // }

  start(): void {
    this.server.invoke('PlayerJoin');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.server.on('Joined', async (playerDto, playersDto, _gameStateDto, _mapDto) => {
      this.loadPlayer(playerDto);
      this.loadEnemies(playersDto);
      // this.loadMap(mapDto);
      // this.gameState = gameStateDto.gameState;
    });

    // this.server.on('GameStateChanged', (gameStateDto) => {
    //   // this.gameState = gameStateDto.gameState;
    // });

    this.server.on('PlayerJoin', async (playerDto) => {
      this.entityManager.addEnemy(playerDto);
    });

    this.server.on('PlayerLeave', (playerId) => {
      const player = this.entityManager.getPlayerById(playerId);
      if (player) this.entityManager.remove(player);
    });

    this.server.on('PlayerMove', (playerId, position) => {
      const player = this.entityManager.getPlayerById(playerId);
      if (player) {
        player.position = new Position(position);
      }
    });

    this.server.on('PlayerPlaceBomb', (bombDto) => {
      const position = new Position(bombDto.position);
      const bomb = this.bombFactory.createBomb(position, bombDto.bombType);
      this.entityManager.add(bomb);
    });

    this.server.on('Explosions', (positionsDto) => {
      positionsDto.forEach((dto) => {
        const position = new Position(dto);

        this.entityManager.removeBombByPosition(position);
        this.entityManager.removePowerupByPosition(position);

        // add explosion
        this.entityManager.addExplosion(position);

        // break wall
        this.entityManager.removeWallByPosition(position);
      });
    });

    this.server.on('UpdateLives', (playerId, lives) => {
      const player = this.entityManager.getPlayer();

      if (!player) return;

      player.lives = lives;

      if (!this.entityManager.isCurrentPlayer(playerId)) return;

      this.uiManager.updateLives(lives);

      const newEffect = this._effects[lives];
      if (this._currentEffect !== newEffect) {
        this._currentEffect.stop();
        this._currentEffect = newEffect;
        this._currentEffect.play();
        this._effectsCount++;
      }

      if (lives > 0) return;

      if (player && player.isDead()) {
        this.audioManager.setSoundManager('dead');
        const visitor = new StatsVisitor();

        this.visitableManagers.forEach((m) => console.log(m.accept(visitor)));
      }
    });

    this.server.on('UpdateScore', (playerId, score) => {
      if (this.entityManager.isCurrentPlayer(playerId)) this.uiManager.updateScore(score);
    });

    this.server.on('UpdateBombCount', (playerId, count) => {
      if (this.entityManager.isCurrentPlayer(playerId)) this.uiManager.updateBombCount(count);
    });

    this.server.on('PlacePowerup', (powerupDto) => {
      const position = new Position(powerupDto.position);
      const powerup = this.powerupFactory.createBomb(position, powerupDto.powerupType);

      this.entityManager.add(powerup);
    });

    this.server.on('RemovePowerup', (positionDto) => {
      const position = new Position(positionDto);
      this.entityManager.removePowerupByPosition(position);
    });

    this.server.on('SendMessage', (playerId, playerName, message) => {
      const player = this.entityManager.getPlayerById(playerId);
      if (!player) return;

      const name = playerName || playerId;

      this.chatManager.onMessage({
        name,
        message,
      });
    });

    this.server.on('PlayerChangeColor', (playerId, { color }) => {
      const player = this.entityManager.getPlayerById(playerId);
      if (!player) return;

      player.color = color;
    });
  }
}
