import { Container } from "inversify";
import { Game } from "./game/game";
import { GameType } from "./game/game.type";

export const defaultContainer = new Container();

defaultContainer
  .bind(GameType)
  .to(Game)
  .inSingletonScope();