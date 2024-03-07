import { inject, injectable } from "inversify";
import { GameEventsType, IGameEvents } from "../events/game-events.type";
import { serviceIdentifier } from "../utils";

@injectable()
export class KeyboardPublisher implements IKeyboardPublisher {
  @inject(GameEventsType)
  readonly events!: IGameEvents;

  constructor() {
    document.addEventListener('keydown', ev => {
      this.keyDown(ev.code);
    });

    document.addEventListener('keyup', ev => {
      this.keyUp(ev.code);
    });
  }

  keyDown(code: string): void {
    this
      .events
      .keyDown
      .publish(code);
  }

  keyUp(code: string): void {
    this
      .events
      .keyUp
      .publish(code);
  }
}

export interface IKeyboardPublisher {
  keyDown(code: string): void;
  keyUp(code: string): void;
}

export const KeyboardPublisherType = serviceIdentifier<IKeyboardPublisher>('KeyboardPublisher');