import { ensured, Ensured } from "./Ensured.ts";
import { sequence } from "./sequence.ts";

export class DeferredMap<TKey = string | symbol, TValue = unknown> {
  #instances = new Map<TKey, TValue>();
  #ensures = new Map<TKey, Ensured<TKey, TValue>>();

  async *entries(): AsyncGenerator<[TKey, TValue], void> {
    for (const entry of this.#instances.entries()) {
      yield entry;
    }
    for await (const envelope of sequence(this.#ensures.values())) {
      const {info, result} = envelope;
      yield [info, result];
    }
  }

  unresolvedKeys(): IterableIterator<TKey> {
    return this.#ensures.keys();
  }

  async get(key: TKey): Promise<TValue> {
    const instance = this.#instances.get(key);
    if (instance !== undefined) {
      return Promise.resolve(instance);
    }
    const ensure = this.#ensures.get(key);
    if (ensure !== undefined) {
      const {result} = await ensure;
      return result;
    }
    const ens = ensured<TKey, TValue>(key);
    this.#ensures.set(key, ens);
    const {result} = await ens;
    return result;
  }

  set(key: TKey, instance: TValue): void {
    this.#instances.set(key, instance);
    const ensure = this.#ensures.get(key);
    if (ensure !== undefined) {
      ensure.resolve(instance);
      this.#ensures.delete(key);
    }
  }
}
