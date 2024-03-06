import { inject, injectable } from "inversify";
import { FallingBlock } from "../../block/falling-block";
import { GameScreenType, IGameScreen } from "./screen.type";
import { serviceIdentifier } from "../utils";

@injectable()
export class BlockRenderer {
  @inject(GameScreenType)
  readonly screen!: IGameScreen;

  get ctx() {
    return this.screen.context;
  }

  render(block: FallingBlock): void {
    this.ctx.fillStyle = block.color;
    for (const part of block.body.iterParts()) {
      this.ctx.fillRect(part.x, part.y, 1, 1);
    }
  }
}

export interface IBlockRenderer {
  render(block: FallingBlock): void;
}

export const BlockRendererType = serviceIdentifier<IBlockRenderer>('BlockRenderer')