import { deferred } from "../deps.ts";
import { PromiseCollector } from "./async/PromiseCollector.ts";

Deno.test("PromiseCollector resolve empty", async () => {
  const promiseCollector = new PromiseCollector();
  await promiseCollector.waitForAll();
});

Deno.test("PromiseCollector resolve with one promise", async () => {
  const promiseCollector = new PromiseCollector();
  const promise = deferred();
  promiseCollector.add(promise);
  const all = promiseCollector.waitForAll();
  promise.resolve();
  await all;
});

Deno.test("PromiseCollector resolve with chain promise", async () => {
  const promiseCollector = new PromiseCollector();
  const promise1 = deferred();
  const promise2 = deferred();
  promiseCollector.add(promise2);
  promiseCollector.add(promise1);
  promise1.then(() => {
    promise2.resolve();
  });
  const all = promiseCollector.waitForAll();
  promise1.resolve();
  await all;
});
