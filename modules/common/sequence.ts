import { Deferred, deferred } from "../deps.ts";

export function sequence<T>(promises: IterableIterator<Promise<T>> | Promise<T>[]): AsyncIterable<T> {
  const resolvedValues = [];
  let promisesCount = 0;
  let defer: Deferred<IteratorResult<T, void>>;

  const when = (value: T) => {
    resolvedValues.push(value);
    defer.resolve({ value, done: false });
    promisesCount--;
  };

  for (const p of promises) {
    promisesCount++;
    p.then(when);
  }

  const next = (): Promise<IteratorResult<T, void>> => {
    if (promisesCount === 0) {
      return Promise.resolve({ value: undefined, done: true });
    }
    defer = deferred();
    return defer;
  };

  return {
    [Symbol.asyncIterator]: () => ({next}),
  };
}
