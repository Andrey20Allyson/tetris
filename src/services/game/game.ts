import { inject, injectable } from "inversify";
import { Opt } from "../../base/opt";
import { FallingBlock } from "../../block/falling-block";
import { GameEventsType, IGameEvents, OnBlockFreeze } from "../events/game-events.type";
import { GameGrid } from "./game-grid";
import { GameObjectFactory } from "./game-object-factory";
import { IGame, IGameObjectsFactory } from "./game.type";

@injectable()
export class Game implements IGame, OnBlockFreeze {
  private _grid: GameGrid;
  private _isGameOver: boolean = false;
  private _currentBlock: Opt<FallingBlock> = Opt.none();
  private _nextBlock: Opt<FallingBlock> = Opt.none();
  private _tickTimerRef: number | null = null;
  private _tickPerSecond: number = 20;
  private _started: boolean = false;
  private _delta: number = 0;

  add: IGameObjectsFactory;

  constructor(
    @inject(GameEventsType) readonly events: IGameEvents,
  ) {
    this.add = new GameObjectFactory(this);
    this._grid = new GameGrid(this, 16, 32);

    this
      .events
      .blockFreeze
      .subscribe(this);
  }

  start(): void {
    if (this._started) return;

    this._started = true;

    this._currentBlock.set(this
      .add
      .random()
      .block()
      .asMain());

    this._nextBlock.set(this
      .add
      .random()
      .block());

    this._initTickTimer();

    this.events.start.publish();
  }

  onBlockFreeze(): void {
    this._currentBlock.set(this
      ._nextBlock
      .unwrap()
      .asMain());

    this._nextBlock.set(this
      .add
      .random()
      .block());
  }

  tick() {
    this
      .events
      .tick
      .publish(this._delta++);
  }

  pause(): void {
    if (this._clearTickTimer() === false) return;

    this
      .events
      .pause
      .publish();
  }

  resume(): void {
    if (this._initTickTimer() === false) return;

    this
      .events
      .resume
      .publish();
  }

  grid(): GameGrid {
    return this._grid;
  }

  getCurrentBlock(): FallingBlock {
    return this._currentBlock.unwrap();
  }

  getNextBlock(): FallingBlock {
    return this._nextBlock.unwrap();
  }

  isGameOver(): boolean {
    return this._isGameOver;
  }

  private _initTickTimer(): boolean {
    if (this._tickTimerRef !== null) return false;

    this._tickTimerRef = setInterval(() => this.tick(), 1000 / this._tickPerSecond);

    return true;
  }

  private _clearTickTimer(): boolean {
    if (this._tickTimerRef === null) return false;

    clearInterval(this._tickTimerRef);

    this._tickTimerRef = null;

    return true;
  }
}