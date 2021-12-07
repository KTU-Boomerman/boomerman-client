import { ChatManager } from "../core/managers/ChatManager";
import { EntityManager } from "../core/managers/EntityManager";
import { NetworkManager } from "../core/managers/NetworkManager";

export interface IVisitor {
    visitChatManager: (manager: ChatManager) => string; // messagesSent
    visitEntityManager: (manager: EntityManager) => string; // explosionCount
    visitNetworkManager: (manager: NetworkManager) => string; // effectsCount
}