export class Opt<T extends {}> {
  private _value: T | undefined | null;
  
  constructor(value?: T | undefined | null) {
    this._value = value;
  }

  set(value?: T | undefined | null): this {
    this._value = value;

    return this;
  }

  hasValue(): boolean {
    return this.isEmpity() === false;
  }

  isEmpity(): boolean {
    return this._value === undefined || this._value === null;
  }

  unwrap(): T {
    const value = this._value;
    if (value === undefined || value === null) throw new TypeError(`Tried to unwrap a undefined or a null`);

    return value;
  }

  static some<T extends {}>(value: T): Opt<T> {
    return new Opt(value);
  }

  static none<T extends {}>(): Opt<T> {
    return new Opt();
  }

  static from<T extends {}>(nullable: T | undefined | null): Opt<T> {
    return new Opt(nullable);
  }
}