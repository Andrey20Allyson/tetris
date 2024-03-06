import { serviceIdentifier } from "../utils";

export interface IGameScreen {
  readonly width: number;
  readonly height: number;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
}

export const GameScreenType = serviceIdentifier<IGameScreen>('GameScreen');