import { inject, injectable } from "inversify";
import { GameEventsType, IGameEvents, OnPause, OnResume, OnStart } from "../events/game-events.type";
import { IFrameController } from "./frame-controller.type";

@injectable()
export class FrameController implements IFrameController, OnStart, OnPause, OnResume {
  private _delta: number = 0;
  private _canRenderNextFrame: boolean = false;

  constructor(
    @inject(GameEventsType)
    readonly events: IGameEvents,
  ) {
    this.events.start.subscribe(this);
    this.events.pause.subscribe(this);
    this.events.resume.subscribe(this);
  }

  onStart(): void {
    this.start();
  }

  onPause(): void {
    this.pause();
  }

  onResume(): void {
    this.resume();
  }

  start(): void {
    if (this._canRenderNextFrame) return;

    this._delta = 0;
    this._canRenderNextFrame = true;
    this._runRenderLoop();
  }

  pause(): void {

  }

  resume(): void {

  }

  frame() {
    this.events.beforeFrame.publish(this._delta);
    this.events.frame.publish(this._delta);
    this.events.afterFrame.publish(this._delta);

    this._delta++;
  }

  private _runRenderLoop() {
    requestAnimationFrame(() => {
      if (this._canRenderNextFrame === false) return;

      this._runRenderLoop();
      this.frame();
    });
  }
}

