import { Container } from "inversify";
import { GameEvents } from "./events/game-events";
import { GameEventsType } from "./events/game-events.type";
import { Game } from "./game/game";
import { GameType } from "./game/game.type";
import { BlockRenderer, BlockRendererType } from "./renderer/block-renderer";
import { FrameController, FrameControllerType } from "./renderer/frame-controller";
import { GridRenderer, GridRendererType } from "./renderer/grid-renderer";
import { Renderer, RendererType } from "./renderer/renderer";
import { GameScreen } from "./renderer/screen";
import { GameScreenType } from "./renderer/screen.type";
import { KeyboardPublisher, KeyboardPublisherType } from "./keyboard/keyboard";

export const defaultContainer = new Container();

defaultContainer
  .bind(GameType)
  .to(Game)
  .inSingletonScope();

defaultContainer
  .bind(GameEventsType)
  .to(GameEvents)
  .inSingletonScope();

defaultContainer
  .bind(GameScreenType)
  .to(GameScreen)
  .inSingletonScope();

defaultContainer
  .bind(FrameControllerType)
  .to(FrameController)
  .inSingletonScope();

defaultContainer
  .bind(RendererType)
  .to(Renderer);

defaultContainer
  .bind(BlockRendererType)
  .to(BlockRenderer);

defaultContainer
  .bind(KeyboardPublisherType)
  .to(KeyboardPublisher);

defaultContainer
  .bind(GridRendererType)
  .to(GridRenderer);