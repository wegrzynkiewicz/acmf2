import { Registry } from "../../common/Registry.ts";
import { debug } from "../../debugger/debug.ts";
import { Deferred, deferred } from "../../deps.ts";
import { GlobalContext, GlobalKey, GlobalService } from "./global.ts";



export type GlobalServiceRegistry = Registry<GlobalService>;

export const globalServiceRegistryService: GlobalService<GlobalServiceRegistry> = {
  globalDeps: [],
  key: "globalServiceRegistry",
  provider: async () => new Registry<GlobalService>(),
};


export class GlobalServiceRegistryX {
  readonly #context: GlobalContext;
  readonly #promises = new Map<GlobalKey, Deferred<unknown>>();
  readonly services = new Map<GlobalKey, GlobalService>();

  public constructor(
    { context }: {
      context: GlobalContext;
    },
  ) {
    this.#context = context;
  }

  public async registerService<T>(globalService: GlobalService): Promise<T> {
    const { key, globalDeps, provider } = globalService;
    const deps = globalDeps.map((g) => g.toString()).join("; ");
    debug({
      channel: "CONTEXT",
      kind: "global-service-registering",
      message: `Registering global service named (${key.toString()}) depends (${deps}).`,
    });
    this.services.set(key, globalService);
    const dependencies = {} as Record<string, unknown>;
    const promises = globalDeps.map(async (dependencyKey: GlobalKey) => {
      const dependency = await this.fetchByKey(dependencyKey);
      dependencies[dependencyKey as string] = dependency;
    });
    await Promise.all(promises);
    const service = await provider(dependencies);
    debug({
      channel: "CONTEXT",
      kind: "global-service-provided",
      message: `Provided global service named (${key.toString()}).`,
    });
    this.#context[key] = service;
    const promise = this.#promises.get(key);
    if (promise !== undefined) {
      promise.resolve(service);
      this.#promises.delete(key);
    }
    return service as T;
  }

  public fetchByKey(serviceKey: GlobalKey): Promise<unknown> {
    const service = this.#context[serviceKey];
    if (service !== undefined) {
      return Promise.resolve(service);
    }
    const promise = this.#promises.get(serviceKey);
    if (promise === undefined) {
      debug({
        channel: "CONTEXT",
        kind: "global-service-waiting",
        message: `Waiting for global service named (${serviceKey.toString()}).`,
      });
      const promise = deferred();
      const race = Promise.race([
        promise,
        this.timeout(serviceKey),
      ]);
      this.#promises.set(serviceKey, promise);
      return race;
    }
    return promise;
  }

  private async timeout(serviceKey: GlobalKey): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        const service = this.services.get(serviceKey);
        if (service === undefined) {
          reject(
            new Error(
              `Cannot resolve service named (${serviceKey.toString()}).`,
            ),
          );
          return;
        }
        const depends = service.globalDeps.map((d) => d.toString()).join(", ");
        reject(
          new Error(
            `Cannot resolve service named (${serviceKey.toString()}) which is depends on (${depends}).`,
          ),
        );
      }, 500);
    });
  }
}
