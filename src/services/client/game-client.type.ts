import { IGameEvents } from "../events/game-events.type";
import { IGame } from "../game/game.type";
import { IKeyboardPublisher } from "../keyboard/keyboard";
import { IFrameController } from "../renderer/frame-controller.type";
import { IRenderer } from "../renderer/renderer";
import { IGameScreen } from "../renderer/screen.type";
import { serviceIdentifier } from "../utils";

export interface IGameClient {
  readonly frames: IFrameController;
  readonly renderer: IRenderer;
  readonly events: IGameEvents;
  readonly game: IGame;
  readonly screen: IGameScreen;
  readonly keyboard: IKeyboardPublisher;

  start(): void;
}

export const GameClientType = serviceIdentifier<IGameClient>('GameClient');