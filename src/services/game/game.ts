import { injectable } from "inversify";
import { GameGrid } from "./game-grid";
import { GameObjectFactory } from "./game-object-factory";
import { IGame, IGameObjectsFactory } from "./game.type";

@injectable()
export class Game implements IGame {
  private _grid: GameGrid;
  add: IGameObjectsFactory;

  constructor() {
    this.add = new GameObjectFactory(this);
    this._grid = new GameGrid(32, 64);
  }

  grid(): GameGrid {
    return this._grid;
  }
}