export type EventSubscriber<D, K extends string> = {
  [Key in K]: (data: D) => void;
}

export type EventParams<S extends object, K extends keyof S> = S[K] extends (...params: infer P) => void ? P : never;

export interface Unsubscriber {
  (): void;
}

export class EventPublisherBindSyntax<S extends object> {
  bind<K extends keyof S>(key: K): EventPublisher<S, K> {
    return new EventPublisher(key);
  }
}

export type SubscriberMethod<P extends any[]> = (...params: P) => void;

export class UnsubscriberStack {
  private static _map = new Map<object, UnsubscriberStack>();

  private _stack: Unsubscriber[] = [];

  add(unsub: Unsubscriber) {
    this._stack.push(unsub);
  }

  unsubscribe(): void {
    this
      ._stack
      .forEach(unsub => unsub());

    this._stack = [];
  }

  static of(sub: object): UnsubscriberStack {
    let stack = this._map.get(sub);

    if (stack === undefined) {
      stack = new UnsubscriberStack();

      this._map.set(sub, stack);
    }

    return stack;
  }
}

export class SubscriberEntity<S extends object, K extends keyof S, P extends any[] = EventParams<S, K>> {
  readonly unsubscriber: Unsubscriber;
  isUnsubscribed: boolean = false;

  constructor(
    readonly publisher: EventPublisher<S, K, P>,
    readonly sub: S,
  ) {

    this.unsubscriber = () => {
      if (this.isUnsubscribed) return;

      this.isUnsubscribed = true;
      this.publisher.unsubscribe(this.sub);
    }

    UnsubscriberStack.of(sub).add(this.unsubscriber);
  }

  call(params: P) {
    const method = this.sub[this.publisher.key] as SubscriberMethod<P>;

    method.apply(this.sub, params);
  }

  has(otherSub: object): boolean {
    return this.sub === otherSub;
  }
}

export class EventPublisher<S extends object, K extends keyof S, P extends any[] = EventParams<S, K>> {
  private _listeners: SubscriberEntity<S, K, P>[] = [];
  readonly key: K;

  constructor(key: K) {
    this.key = key;
  }

  private _call(sub: S, params: P): void {
    const method = sub[this.key] as SubscriberMethod<P>;

    method.apply(sub, params);
  }

  subscribe(sub: S): Unsubscriber {
    if (typeof sub[this.key] !== 'function') throw new TypeError(`Subscriber.${String(this.key)} is not a function`);

    const entity = new SubscriberEntity(this, sub)

    this._listeners.push(entity);

    return entity.unsubscriber;
  }

  once(sub: S): Unsubscriber {
    const unsub = this.subscribe({
      [this.key]: (...params: P) => {
        this._call(sub, params);

        unsub();
      }
    } as S);

    return unsub;
  }

  publish(...params: P): this {
    this._listeners.forEach(sub => sub.call(params));

    return this;
  }

  unsubscribe(sub: S): this {
    this._listeners = this._listeners.filter(entity => {
      if (entity.has(sub)) {
        entity.isUnsubscribed = true;

        return false;
      }

      return true;
    });

    return this;
  }

  static for<S extends object>(): EventPublisherBindSyntax<S> {
    return new EventPublisherBindSyntax();
  }
}

export function unsub(sub: object): void {
  UnsubscriberStack
    .of(sub)
    .unsubscribe();
}