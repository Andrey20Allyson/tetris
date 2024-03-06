import { serviceIdentifier } from "../utils";
import { EventPublisher } from "../../base/event-pub";

export interface OnTick {
  onTick(delta: number): void;
}

export interface OnInput {
  onKeyDown(code: string): void;
  onKeyUp(code: string): void;
}

export interface OnStart {
  onStart(): void;
}

export interface OnResume {
  onResume(): void;
}

export interface OnPause {
  onPause(): void;
}

export interface OnBeforeFrame {
  onBeforeFrame(delta: number): void;
}

export interface OnFrame {
  onFrame(delta: number): void;
}

export interface OnAfterFrame {
  onAfterFrame(delta: number): void;
}

export interface IGameEvents {
  readonly tick: EventPublisher<OnTick, 'onTick'>;
  readonly keyDown: EventPublisher<OnInput, 'onKeyDown'>;
  readonly keyUp: EventPublisher<OnInput, 'onKeyUp'>;
  readonly start: EventPublisher<OnStart, 'onStart'>;
  readonly resume: EventPublisher<OnResume, 'onResume'>;
  readonly pause: EventPublisher<OnPause, 'onPause'>;
  readonly frame: EventPublisher<OnFrame, 'onFrame'>;
  readonly afterFrame: EventPublisher<OnAfterFrame, 'onAfterFrame'>;
  readonly beforeFrame: EventPublisher<OnBeforeFrame, 'onBeforeFrame'>;
}

export const GameEventsType = serviceIdentifier<IGameEvents>('IGameEvents')