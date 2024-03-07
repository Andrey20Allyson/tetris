import { inject, injectable } from "inversify";
import { GameEventsType, IGameEvents } from "../events/game-events.type";
import { GameType, IGame } from "../game/game.type";
import { IKeyboardPublisher, KeyboardPublisherType } from "../keyboard/keyboard";
import { IRenderer, RendererType } from "../renderer/renderer";
import { GameScreenType, IGameScreen } from "../renderer/screen.type";
import { IGameClient } from "./game-client.type";
import { FrameControllerType, IFrameController } from "../renderer/frame-controller.type";

@injectable()
export class GameClient implements IGameClient {
  @inject(GameEventsType)
  readonly events!: IGameEvents;

  @inject(FrameControllerType)
  readonly frames!: IFrameController;

  @inject(RendererType)
  readonly renderer!: IRenderer;

  @inject(GameType)
  readonly game!: IGame;

  @inject(GameScreenType)
  readonly screen!: IGameScreen;

  @inject(KeyboardPublisherType)
  readonly keyboard!: IKeyboardPublisher;

  constructor() { }

  start(): void {
    this
      .game
      .start();
  }
}