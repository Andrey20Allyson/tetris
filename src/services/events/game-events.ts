import { injectable } from "inversify";
import { EventPublisher } from "../../base/event-pub";
import { IGameEvents, OnAfterFrame, OnBeforeFrame, OnFrame, OnInput, OnPause, OnResume, OnStart, OnTick } from "./game-events.type";

@injectable()
export class GameEvents implements IGameEvents {
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

  unsubscribe(sub: any): IGameEvents {
    Object
      .values(this)
      .forEach(value => {
        if (value instanceof EventPublisher) {
          value.unsubscribe(sub);
        }
      });

    return this;
  }
}