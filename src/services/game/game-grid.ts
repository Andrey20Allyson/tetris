import { FallingBlock } from "../../block/falling-block";
import { Vec2 } from "../../base/vec";
import { OnBlockFreeze, OnLineComplete, OnLineRemoveAnimationEnd } from "../events/game-events.type";
import { IGame } from "./game.type";

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

export class GameGrid implements OnBlockFreeze, OnLineRemoveAnimationEnd, OnLineComplete {
  private _grid: Partial<Record<string, GameGridValue>> = {};

  constructor(
    readonly game: IGame,
    readonly width: number,
    readonly height: number,
  ) {
    this
      .events
      .blockFreeze
      .subscribe(this);

    this
      .events
      .lineComplete
      .subscribe(this);

    this
      .events
      .lineRemoveAnimationEnd
      .subscribe(this);
  }

  get events() {
    return this.game.events;
  }

  onBlockFreeze(block: FallingBlock): void {
    this.add(block);

    const changedLines = Array
      .from(block.body.iterParts())
      .reduce((hashSet, part) => hashSet.add(part.y), new Set<number>())
      .values();

    this
      .listCompletedLines(changedLines)
      .forEach(line => this
        .game
        .events
        .lineComplete
        .publish(line, this));
  }

  onLineComplete(line: number, grid: GameGrid): void {
    setTimeout(() => {
      this.game.events.lineRemoveAnimationEnd.publish(line, grid);
    }, 500);
  }

  onLineRemoveAnimationEnd(line: number, grid: GameGrid): void {
    if (this !== grid) return;

    this.removeLine(line);
  }

  isCompleted(line: number): boolean {
    for (let collumn = 0; collumn < this.width; collumn++) {
      if (this.has(new Vec2(collumn, line)) === false) {
        return false;
      }
    }

    return true;
  }

  *iterLines(): Iterable<number> {
    for (let y = 0; y < this.height; y++) {
      yield y;
    }
  }

  *iterLineValues(line: number): Iterable<[pos: Vec2, value: GameGridValue | undefined]> {
    for (let x = 0; x < this.width; x++) {
      const pos = new Vec2(x, line);
      const value = this.get(pos);

      yield [pos, value];
    }
  }

  removeLine(line: number): void {
    for (let collumn = 0; collumn < this.width; collumn++) {
      this.remove(new Vec2(collumn, line));
    }

    this.makeLinesAboveFall(line);
  }

  makeLinesAboveFall(limit: number): void {
    for (let line = limit; line >= 0; line--) {
      for (const [pos] of this.iterLineValues(line)) {
        const nextPos = pos.sumv(0, 1);

        this.move(pos, nextPos);
      }
    }
  }

  listCompletedLines(changedLines: Iterable<number> = this.iterLines()): number[] {
    return Array
      .from(changedLines)
      .filter(line => this.isCompleted(line));
  }

  remove(pos: Vec2): boolean {
    return delete this._grid[pos.stringify()];
  }

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

    this.remove(from);
    this.add(value.withPos(to));

    return this;
  }

  *iter(): Iterable<GameGridValue> {
    for (const key in this._grid) {
      yield this._grid[key]!;
    }
  }
}