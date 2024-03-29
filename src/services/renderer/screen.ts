import { injectable } from "inversify";
import { Opt } from "../../base/opt";
import { IGameScreen } from "./screen.type";

@injectable()
export class GameScreen extends IGameScreen {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;

  constructor() {
    super();

    this.canvas = Opt.from(document.querySelector<HTMLCanvasElement>('#screen')).unwrap();
    this.context = Opt.from(this.canvas.getContext('2d')).unwrap();
  }
}