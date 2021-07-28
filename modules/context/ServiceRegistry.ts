import { debug } from "../debugger/debug.ts";
import { Deferred, deferred } from "../deps.ts";
import { lowerCaseFirstLetter } from "../useful/lowerCaseFirstLetter.ts";
import { Context } from "./Context.ts";

export type ServiceConstructor<T> = new (...args: any[]) => T;

async function timeout(serviceKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Cannot resolve service named (${serviceKey}).`));
    }, 500);
  });
}

export class ServiceRegistry {
  private readonly context: Context;
  private readonly promises = new Map<string, Deferred<unknown>>();

  public constructor(
    { context }: {
      context: Context;
    },
  ) {
    this.context = context;
  }

  public registerServices(services: Record<string, unknown>): void {
    for (const [serviceKey, service] of Object.entries(services)) {
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
  }

  public fetchByName<T = unknown>(serviceKey: string): Promise<T> {
    const service = this.context[serviceKey] as T | undefined;
    if (service !== undefined) {
      return Promise.resolve(service);
    }
    const promise = this.promises.get(serviceKey);
    if (promise === undefined) {
      const promise = deferred();
      const race = Promise.race([
        promise,
        timeout(serviceKey),
      ])
      this.promises.set(serviceKey, promise);
      return race as Promise<T>;
    }
    return promise as Promise<T>;
  }

  public async fetchByCreator<T>(
    serviceConstructor: ServiceConstructor<T>,
  ): Promise<T> {
    const serviceKey = lowerCaseFirstLetter(serviceConstructor.name);
    const promise = this.fetchByName<T>(serviceKey);
    return promise;
  }
}
