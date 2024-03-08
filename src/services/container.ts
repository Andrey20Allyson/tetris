import { Container } from "inversify";
import { GameClient } from "./client/game-client";
import { GameClientType } from "./client/game-client.type";
import { GameEvents } from "./events/game-events";
import { GameEventsType } from "./events/game-events.type";
import { Game } from "./game/game";
import { GameType } from "./game/game.type";
import { KeyboardPublisher, KeyboardPublisherType } from "./keyboard/keyboard";
import { BlockRenderer, BlockRendererType } from "./renderer/block-renderer";
import { GridRenderer, GridRendererType } from "./renderer/grid-renderer";
import { Renderer, RendererType } from "./renderer/renderer";
import { GameScreen } from "./renderer/screen";
import { GameScreenType } from "./renderer/screen.type";
import { FrameController } from "./renderer/frame-controller";
import { FrameControllerType } from "./renderer/frame-controller.type";
import { NextBlockScreenType } from "./renderer/next-block-screen.type";
import { NextBlockScreen } from "./renderer/next-block-screen";
import { NextBlockRenderer, NextBlockRendererType } from "./renderer/next-block-renderer";

export const defaultContainer = new Container();

defaultContainer
  .bind(GameEventsType)
  .to(GameEvents)
  .inSingletonScope();

defaultContainer
  .bind(GameType)
  .to(Game)
  .inSingletonScope();

defaultContainer
  .bind(GameScreenType)
  .to(GameScreen)
  .inSingletonScope();

defaultContainer
  .bind(NextBlockScreenType)
  .to(NextBlockScreen)
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
  .bind(NextBlockRendererType)
  .to(NextBlockRenderer);

defaultContainer
  .bind(KeyboardPublisherType)
  .to(KeyboardPublisher);

defaultContainer
  .bind(GridRendererType)
  .to(GridRenderer);

defaultContainer
  .bind(GameClientType)
  .to(GameClient);