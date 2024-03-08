import { injectable } from "inversify";
import { serviceIdentifier } from "../utils";

@injectable()
export abstract class IGameScreen {
  abstract readonly canvas: HTMLCanvasElement;
  abstract readonly context: CanvasRenderingContext2D;
  
  get width() {
    return this.canvas.width;
  }
  
  get height() {
    return this.canvas.height;
  }
  
  clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

export const GameScreenType = serviceIdentifier<IGameScreen>('GameScreen');