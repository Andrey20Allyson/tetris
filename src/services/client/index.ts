import { defaultContainer } from "../container";
import { GameClientType, IGameClient } from "./game-client.type";

export function createClient(): IGameClient {
  return defaultContainer.get(GameClientType);
}