import { IVisitor } from "../../interfaces/IVisitor";
import { ChatManager } from "./ChatManager";
import { EntityManager } from "./EntityManager";
import { NetworkManager } from "./NetworkManager";

export class StatsVisitor implements IVisitor {
    public visitChatManager (manager: ChatManager): string  {
        return `Players have written ${manager.getMessageCount()} messages.`;
    }

    public visitEntityManager (manager: EntityManager): string {
        return `${manager.getExplosionCount()} bombs have exploded.`;
    }

    public visitNetworkManager (manager: NetworkManager): string {
        return `${manager.getEffectsCount()} effects have been applied.`;
    }
}
