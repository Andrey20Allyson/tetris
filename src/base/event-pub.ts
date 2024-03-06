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

export class EventPublisher<S extends object, K extends keyof S, P extends any[] = EventParams<S, K>> {
  private _listeners: S[] = [];
  private readonly _key: K;

  constructor(key: K) {
    this._key = key;
  }

  private _call(sub: S, params: P): void {
    const method = sub[this._key] as SubscriberMethod<P>;

    method.apply(sub, params);
  }

  subscribe(sub: S): Unsubscriber {
    if (typeof sub[this._key] !== 'function') throw new TypeError(`Subscriber.${String(this._key)} is not a function`);

    this._listeners.push(sub);

    return () => this.unsubscribe(sub);
  }

  once(sub: S): Unsubscriber {
    const unsub = this.subscribe({
      [this._key]: (...params: P) => {
        this._call(sub, params);

        unsub();
      }
    } as S);

    return unsub;
  }

  publish(...params: P): this {
    this._listeners.forEach(sub => this._call(sub, params));

    return this;
  }

  unsubscribe(sub: S): this {
    this._listeners = this._listeners.filter(savedSub => sub !== savedSub);

    return this;
  }

  static for<S extends object>(): EventPublisherBindSyntax<S> {
    return new EventPublisherBindSyntax();
  }
}