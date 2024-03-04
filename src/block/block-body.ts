import { Vec2 } from "../base/vec";
import { FallingBlock } from "./falling-block";

export class BlockBody {
  constructor(
    readonly owner: FallingBlock,
    readonly deltas: Vec2[],
  ) { }

  get pos() {
    return this.owner.pos;
  }

  *iterParts(): Iterable<Vec2> {
    for (let delta of this.deltas) {
      let x = this.pos.x + delta.x;
      let y = this.pos.y + delta.y;

      yield new Vec2(x, y);
    }
  }

  rotated(): BlockBody {
    const rotatedDeltas: Vec2[] = [];

    for (let delta of this.deltas) {
      // Aplica a rotação 90 graus no sentido anti-horário
      // (troca x e y, invertendo o sinal do x)
      const rotatedX = -delta.y;
      const rotatedY = delta.x;

      rotatedDeltas.push(new Vec2(rotatedX, rotatedY));
    }

    return new BlockBody(this.owner, rotatedDeltas);
  }
}