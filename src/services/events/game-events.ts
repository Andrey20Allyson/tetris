import { injectable } from "inversify";
import { EventPublisher } from "../../base/event-pub";
import {
  IGameEvents,
  OnAfterFrame,
  OnBeforeFrame,
  OnBlockFreeze,
  OnFrame,
  OnGameOver,
  OnInput,
  OnLineComplete,
  OnLineRemoveAnimationEnd,
  OnPause,
  OnResume,
  OnStart,
  OnTick,
} from "./game-events.type";

@injectable()
export class GameEvents implements IGameEvents {
  readonly blockFreeze = EventPublisher
    .for<OnBlockFreeze>()
    .bind('onBlockFreeze');

  readonly lineComplete = EventPublisher
    .for<OnLineComplete>()
    .bind('onLineComplete');

  readonly lineRemoveAnimationEnd = EventPublisher
    .for<OnLineRemoveAnimationEnd>()
    .bind('onLineRemoveAnimationEnd');

  readonly gameOver = EventPublisher
    .for<OnGameOver>()
    .bind('onGameOver');

  readonly frame = EventPublisher
    .for<OnFrame>()
    .bind('onFrame');

  readonly afterFrame = EventPublisher
    .for<OnAfterFrame>()
    .bind('onAfterFrame');

  readonly beforeFrame = EventPublisher
    .for<OnBeforeFrame>()
    .bind('onBeforeFrame');

  readonly start = EventPublisher
    .for<OnStart>()
    .bind('onStart');

  readonly resume = EventPublisher
    .for<OnResume>()
    .bind('onResume');

  readonly pause = EventPublisher
    .for<OnPause>()
    .bind('onPause');

  readonly tick = EventPublisher
    .for<OnTick>()
    .bind('onTick');

  readonly keyDown = EventPublisher
    .for<OnInput>()
    .bind('onKeyDown');

  readonly keyUp = EventPublisher
    .for<OnInput>()
    .bind('onKeyUp');
}