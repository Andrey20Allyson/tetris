import { FallingBlock } from "../../block/falling-block";
import { Vec2 } from "../../base/vec";

export class GameGridValue {
  constructor(
    readonly pos: Vec2,
    readonly color: string,
  ) { }

  withPos(pos: Vec2): GameGridValue {
    return new GameGridValue(
      pos,
      this.color,
    );
  }
}

export class GameGrid {
  private _grid: Partial<Record<string, GameGridValue>> = {};

  constructor(
    readonly width: number,
    readonly height: number,
  ) { }

  has(pos: Vec2): boolean {
    return this._grid[pos.stringify()] !== undefined;
  }

  get(pos: Vec2): GameGridValue | undefined {
    return this._grid[pos.stringify()];
  }

  add(block: FallingBlock): this;
  add(value: GameGridValue): this;
  add(arg0: FallingBlock | GameGridValue): this {
    if (arg0 instanceof FallingBlock) {
      for (const part of arg0.body.iterParts()) {
        this.add(new GameGridValue(part, arg0.color));
      }

      return this;
    }

    this._grid[arg0.pos.stringify()] = arg0;

    return this;
  }

  move(from: Vec2, to: Vec2): this {
    const value = this.get(from);
    if (value === undefined) return this;

    this.add(value.withPos(to));

    return this;
  }

  *iter(): Iterable<GameGridValue> {
    for (const key in this._grid) {
      yield this._grid[key]!;
    }
  }
}