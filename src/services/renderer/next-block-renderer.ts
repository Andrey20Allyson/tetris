import { inject, injectable } from "inversify";
import { FallingBlock } from "../../block/falling-block";
import { serviceIdentifier } from "../utils";
import { IBlockRenderer } from "./block-renderer";
import { NextBlockScreenType } from "./next-block-screen.type";
import { IGameScreen } from "./screen.type";

@injectable()
export class NextBlockRenderer {
  @inject(NextBlockScreenType)
  readonly screen!: IGameScreen;

  get ctx() {
    return this.screen.context;
  }

  render(block: FallingBlock): void {
    this.ctx.fillStyle = block.color;
    for (const part of block.body.iterParts()) {
      this.ctx.fillRect(part.x - 5, part.y + 2, 1, 1);
    }
  }
}

export const NextBlockRendererType = serviceIdentifier<IBlockRenderer>('NextBlockRenderer')