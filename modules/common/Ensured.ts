export interface Envelope<TInfo, TResult> {
  info: TInfo;
  promise: Promise<Envelope<TInfo, TResult>>;
  result: TResult;
}

export interface Ensured<TInfo, TResult> extends Promise<Envelope<TInfo, TResult>> {
  readonly state: "pending" | "fulfilled" | "rejected";
  resolve(value?: TResult | PromiseLike<TResult>): void;
  // deno-lint-ignore no-explicit-any
  reject(reason?: any): void;
}

export function ensured<TInfo, TResult>(info: TInfo): Ensured<TInfo, TResult> {
  let additional;
  let state = "pending";
  const promise = new Promise<Envelope<TInfo, TResult>>((resolve, reject): void => {
    additional = {
      async resolve(result: TResult) {
        await result;
        state = "fulfilled";
        const envelope = { info, promise, result };
        resolve(envelope);
      },
      // deno-lint-ignore no-explicit-any
      reject(reason?: any) {
        state = "rejected";
        reject(reason);
      },
    };
  });
  Object.defineProperty(promise, "state", { get: () => state });
  const ensured = Object.assign(promise, additional) as Ensured<TInfo, TResult>;
  return ensured;
}
