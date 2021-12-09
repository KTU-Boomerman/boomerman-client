import { IVisitor } from '../../interfaces/IVisitor';
import { ChatManager } from './ChatManager';
import { EffectManager } from './EffectManager';
import { EntityManager } from './EntityManager';

export class StatsVisitor implements IVisitor {
  public visitChatManager(manager: ChatManager): string {
    return `Players have written ${manager.getMessageCount()} messages.`;
  }

  public visitEntityManager(manager: EntityManager): string {
    return `${manager.getPlacedBombCount()} bombs have exploded.`;
  }

  public visitEffectManager(manager: EffectManager): string {
    return `${manager.getEffectsCount()} effects have been applied.`;
  }
}
