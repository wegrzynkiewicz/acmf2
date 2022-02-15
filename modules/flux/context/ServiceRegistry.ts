import { debug } from "../../debugger/debug.ts";
import { Deferred, deferred } from "../../deps.ts";

export type GenericTuple<TTuple, TContext> = {
  [P in keyof TTuple]: TTuple[P] extends keyof TContext ? TContext[TTuple[P]]
    : never;
};

async function timeout(serviceKey: symbol): Promise<void> {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Cannot resolve service named (${serviceKey.description}).`),
      );
    }, 500);
  });
}

export class ServiceRegistry<TContext> {
  private readonly context: TContext;
  private readonly promises = new Map<keyof TContext, Deferred<unknown>>();

  public constructor(
    { context }: {
      context: TContext;
    },
  ) {
    this.context = context;
  }

  public registerServices<K extends keyof TContext>(
    services: Record<K, TContext[K]>,
  ): void {
    for (const serviceKey of Object.getOwnPropertySymbols(services) as K[]) {
      const service = services[serviceKey];
      this.registerService(serviceKey, service);
    }
    for (const serviceKey of Object.keys(services) as K[]) {
      const service = services[serviceKey];
      this.registerService(serviceKey, service);
    }
  }

  public registerService<K extends keyof TContext>(
    serviceKey: K,
    service: TContext[K],
  ): void {
    debug({
      channel: "CONTEXT",
      kind: "context-service-registering",
      message: `Registering service (${serviceKey.toString()}).`,
    });
    this.context[serviceKey] = service;
    const promise = this.promises.get(serviceKey);
    if (promise !== undefined) {
      promise.resolve(service);
      this.promises.delete(serviceKey);
    }
  }

  public async fetchByKeys<TTuple extends (keyof TContext)[]>(
    keys: [...TTuple],
  ): Promise<GenericTuple<TTuple, TContext>> {
    const promises = keys.map((key) => this.fetchByKey(key));
    const tuple = await Promise.all(promises);
    return tuple as unknown as GenericTuple<TTuple, TContext>;
  }

  public fetchByKey<K extends keyof TContext>(
    serviceKey: K,
  ): Promise<TContext[K]> {
    const service = this.context[serviceKey];
    if (service !== undefined) {
      return Promise.resolve(service);
    }
    const promise = this.promises.get(serviceKey);
    if (promise === undefined) {
      const promise = deferred();
      const race = Promise.race([
        promise,
        timeout(serviceKey as symbol),
      ]);
      this.promises.set(serviceKey, promise);
      return race as Promise<TContext[K]>;
    }
    return promise as Promise<TContext[K]>;
  }
}
