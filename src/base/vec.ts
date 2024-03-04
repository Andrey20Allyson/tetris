export class Vec2 {
  constructor(
    readonly x: number = 0,
    readonly y: number = 0,
  ) { }

  sum(other: Vec2) {
    return this.sumv(
      other.x,
      other.y,
    );
  }

  sumv(x: number = 0, y: number = 0): Vec2 {
    return new Vec2(
      this.x + x,
      this.y + y,
    );
  }

  stringify(): string {
    return `${this.x}:${this.y}`;
  }
}