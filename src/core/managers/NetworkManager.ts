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
import { UIManager } from './UIManager';

@singleton()
export class NetworkManager extends GameObject {
  constructor(
    @inject('Server') private server: Server,
    @inject(BombFactory) private bombFactory: BombFactory,
    @inject(PowerupFactory) private powerupFactory: PowerupFactory,
    @inject(EffectManager) private effectManager: EffectManager,
    @inject(UIManager) private uiManager: UIManager,
    @inject(EntityManager) private entityManager: EntityManager,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {
    super();
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

      if (lives > 0) return;

      const deathEffect = this.effectManager.createEffect(this.audioManager.getSoundManager(), {
        sound: 'death',
        visual: 'grayscale',
        animation: 'shake',
      });
      deathEffect.play();
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
  }
}
