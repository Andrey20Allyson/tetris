import { inject, injectable } from "inversify";
import { GameGrid } from "../game/game-grid";
import { serviceIdentifier } from "../utils";
import { GameScreenType, IGameScreen } from "./screen.type";

@injectable()
export class GridRenderer {
  @inject(GameScreenType)
  readonly screen!: IGameScreen;

  get ctx() {
    return this.screen.context;
  }

  render(grid: GameGrid): void {
    for (const { pos, color } of grid.iter()) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }
}

export interface IGridRenderer {
  render(grid: GameGrid): void;
}

export const GridRendererType = serviceIdentifier<IGridRenderer>('GridRenderer')