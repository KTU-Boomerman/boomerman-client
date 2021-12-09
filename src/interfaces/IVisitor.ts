import { ChatManager } from '../core/managers/ChatManager';
import { EffectManager } from '../core/managers/EffectManager';
import { EntityManager } from '../core/managers/EntityManager';

export interface IVisitor {
  visitChatManager: (manager: ChatManager) => string; // messagesSent
  visitEntityManager: (manager: EntityManager) => string; // explosionCount
  visitEffectManager: (manager: EffectManager) => string; // effectsCount
}
