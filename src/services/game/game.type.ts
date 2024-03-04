import { Vec2 } from "../../base/vec";
import { FallingBlock } from "../../block/falling-block";
import { serviceIdentifier } from "../utils";
import { GameGrid } from "./game-grid";

export interface CreateBlockOptions {
  pos?: Vec2;
  body?: Vec2[];
  color?: string;
}

export interface IGameObjectsFactory {
  ramdom(): IGameObjectsFactory;
  block(options?: CreateBlockOptions): FallingBlock;
}

export interface IGame {
  readonly add: IGameObjectsFactory;

  grid(): GameGrid;
}

export const GameType = serviceIdentifier<IGame>('IGame');