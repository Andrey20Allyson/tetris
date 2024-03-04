import { BLOCK_OPTIONS_PRESET } from "../../block/block-factory.defaults";
import { FallingBlock } from "../../block/falling-block";
import { IGameObjectsFactory, IGame, CreateBlockOptions } from "./game.type";

export class RandomGameObjectFactory implements IGameObjectsFactory {
  constructor(
    readonly game: IGame,
  ) { }

  ramdom(): IGameObjectsFactory {
    return this;
  }

  block(options?: CreateBlockOptions | undefined): FallingBlock {
    const randomOption = BLOCK_OPTIONS_PRESET[Math.trunc(Math.random() * BLOCK_OPTIONS_PRESET.length)];

    return new FallingBlock(
      this.game,
      options?.body ?? randomOption.body,
      options?.pos ?? randomOption.pos,
      options?.color ?? randomOption.color,
    );
  }
}

export class GameObjectFactory implements IGameObjectsFactory {
  private _random: IGameObjectsFactory;

  constructor(
    readonly game: IGame,
  ) {
    this._random = new RandomGameObjectFactory(this.game);
  }

  ramdom(): IGameObjectsFactory {
    return this._random;
  }

  block(options?: CreateBlockOptions): FallingBlock {
    return new FallingBlock(this.game, options?.body, options?.pos, options?.color);
  }
}