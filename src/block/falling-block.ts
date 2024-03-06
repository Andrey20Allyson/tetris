import { Vec2 } from "../base/vec";
import { OnTick } from "../services/events/game-events.type";
import { IGame } from "../services/game/game.type";
import { BlockBody } from "./block-body";

export type BlockMovement = 'left' | 'right';

export class FallingBlock implements OnTick {
  private _isFreezed: boolean = false;
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

  onTick(delta: number) {
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