import { Deferred, deferred } from "../deps.ts";

export class DeferredMap<TKey = string | symbol, TValue = unknown> {
  #instances = new Map<TKey, TValue>();
  #promises = new Map<TKey, Deferred<TValue>>();

  get(key: TKey): Promise<TValue> {
    const instance = this.#instances.get(key);
    if (instance !== undefined) {
      return Promise.resolve(instance);
    }
    const promise = this.#promises.get(key);
    if (promise !== undefined) {
      return promise;
    }
    const def = deferred<TValue>();
    this.#promises.set(key, def);
    return def;
  }

  set(key: TKey, instance: TValue): void {
    this.#instances.set(key, instance);
    const promise = this.#promises.get(key);
    if (promise !== undefined) {
      promise.resolve(instance);
      this.#promises.delete(key);
    }
  }
}
