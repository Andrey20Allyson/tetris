import { injectable } from "inversify";
import { Opt } from "../../base/opt";
import { IGameScreen } from "./screen.type";

@injectable()
export class GameScreen implements IGameScreen {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = Opt.from(document.querySelector<HTMLCanvasElement>('#screen')).unwrap();
    this.context = Opt.from(this.canvas.getContext('2d')).unwrap();
  }

  get height() {
    return this.canvas.height;
  }

  get width() {
    return this.canvas.width;
  }
}