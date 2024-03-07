import { Unsubscriber, unsub } from "../base/event-pub";
import { Vec2 } from "../base/vec";
import { OnInput, OnTick } from "../services/events/game-events.type";
import { IGame } from "../services/game/game.type";
import { BlockBody } from "./block-body";

export type BlockMovement = 'left' | 'right';

export class FallingBlock implements OnTick, OnInput {
  private _isFreezed: boolean = false;
  private _isMain: boolean = false;
  private _rotateTimes: number = 0;
  private _movementQueue: BlockMovement[] = [];

  pos: Vec2;
  body: BlockBody;
  color: string;
  fastFall: boolean = false;

  constructor(
    readonly game: IGame,
    body: Vec2[] = [],
    pos: Vec2 = new Vec2(7, 0),
    color: string = '#fff',
  ) {
    this.pos = pos;
    this.body = new BlockBody(this, body);
    this.color = color;
  }

  onKeyDown(code: string): void {
    switch (code) {
      case 'ArrowLeft':
        this.enqueueMovement('left');
        return;
      case 'ArrowRight':
        this.enqueueMovement('right');
        return;
      case 'ArrowDown':
        this.fastFall = true;
        return;
      case 'ArrowUp':
        this.enqueueRotation();
        return;
    }
  }

  onKeyUp(code: string): void {
    console.log(code);

    switch (code) {
      case 'ArrowDown':
        this.fastFall = false;
        return;
    }
  }

  onTick(delta: number) {
    this.tick(delta);
  }

  tick(delta: number) {
    if (this._rotateTimes > 0) {
      this._rotateTimes--;

      this._rotate();
    }

    let movement = this._movementQueue.shift();
    if (movement !== undefined) {
      switch (movement) {
        case "left":
          this._move(-1);
          break;
        case "right":
          this._move(1);
          break;
      }
    }

    if (delta % (this.fastFall ? 1 : 10) === 0) {
      this.fall();
    }
  }

  asMain(): this {
    if (this._isMain === true) return this;

    this._isMain = true;

    this
      .game
      .events
      .tick
      .subscribe(this);

    this
      .game
      .events
      .keyDown
      .subscribe(this);

    this
      .game
      .events
      .keyUp
      .subscribe(this);

    return this;
  }

  setBody(deltas: Vec2[]): this {
    this.body = new BlockBody(this, deltas);
    return this;
  }

  setColor(color: string): this {
    this.color = color;
    return this;
  }

  enqueueMovement(direction: BlockMovement): this {
    this._movementQueue.push(direction);

    return this;
  }

  private _move(direction: number) {
    let canMove = true;

    for (const part of this.body.iterParts()) {
      const nextPos = part.sumv(direction);

      if (nextPos.x < 0 || nextPos.x > this.game.grid().width - 1) {
        canMove = false;
        break;
      }

      if (this.game.grid().has(nextPos)) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      this.pos = this.pos.sumv(direction);
    }
  }

  fall(): this {
    if (this._isFreezed) return this;

    const grid = this.game.grid();

    let canFall = true;
    for (const part of this.body.iterParts()) {
      const nextPos = part.sumv(0, 1);

      if (part.y >= grid.height - 1 || grid.has(nextPos)) {
        canFall = false;
        break;
      }
    }

    if (canFall === false) {
      this.freeze();
      return this;
    }

    this.pos = this.pos.sumv(0, 1);

    return this;
  }

  freeze() {
    if (this._isFreezed) return;

    this._isFreezed = true;

    unsub(this);

    this._isMain = false;
  }

  enqueueRotation(): this {
    this._rotateTimes++;

    return this;
  }

  private _canRotate(rotatedBody: BlockBody = this.body.rotated()) {
    for (let pos of rotatedBody.iterParts()) {
      if (
        pos.x < 0
        || pos.x > this.game.grid().width - 1
        || pos.y > this.game.grid().height - 1
        || this.game.grid().has(pos)
      ) {
        return false;
      }
    }

    return true;
  }

  private _rotate() {
    const rotatedBody = this.body.rotated();

    if (this._canRotate(rotatedBody)) {
      this.body = rotatedBody;
    }
  }
}