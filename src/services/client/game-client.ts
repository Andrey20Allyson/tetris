import { inject } from "inversify";
import { defaultContainer } from "../container";
import { GameEventsType, IGameEvents } from "../events/game-events.type";
import { GameType, IGame } from "../game/game.type";
import { IKeyboardPublisher, KeyboardPublisherType } from "../keyboard/keyboard";
import { IRenderer, RendererType } from "../renderer/renderer";
import { GameScreenType, IGameScreen } from "../renderer/screen.type";
import { serviceIdentifier } from "../utils";

export class GameClient implements IGameClient {
  @inject(RendererType)
  readonly renderer!: IRenderer;

  @inject(GameEventsType)
  readonly events!: IGameEvents;

  @inject(GameType)
  readonly game!: IGame;

  @inject(GameScreenType)
  readonly screen!: IGameScreen;

  @inject(KeyboardPublisherType)
  readonly keyboard!: IKeyboardPublisher;

  start(): void {
    this
      .game
      .start();
  }

  static create(): IGameClient {
    return defaultContainer.get(GameClientType);
  }
}

export interface IGameClient {
  readonly renderer: IRenderer;
  readonly events: IGameEvents;
  readonly game: IGame;
  readonly screen: IGameScreen;
  readonly keyboard: IKeyboardPublisher;

  start(): void;
}

export const GameClientType = serviceIdentifier<IGameClient>('GameClient');