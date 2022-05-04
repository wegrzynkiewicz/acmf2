import { DeferredMap } from "../../common/async/DeferredMap.ts";
import { GlobalKey, GlobalService } from "./global.ts";

export class GlobalServiceResolver {
  // readonly #globalContext: GlobalContext;
  readonly #instances = new DeferredMap<GlobalKey, unknown>();
  // readonly #globalServiceRegistry: GlobalServiceRegistry;

  // public constructor(
  //   { globalContext, globalServiceRegistry }: {
  //     globalContext: GlobalContext;
  //     globalServiceRegistry: GlobalContext;
  //   },
  // ) {
  //   this.#globalServiceRegistry = globalServiceRegistry;
  //   this.#globalContext = globalContext;
  // }

  public async resolveDependentServices(globalDeps: GlobalKey[]): Promise<Record<GlobalKey, unknown>> {
    const promises = globalDeps.map(async (key: GlobalKey): Promise<[GlobalKey, unknown]> => {
      const instance = await this.#instances.get(key);
      return [key, instance];
    });
    const entries = await Promise.all(promises);
    const dependencies = Object.fromEntries(entries);
    return dependencies;
  }

  public resolveService<T>(globalService: GlobalService): Promise<T> {
    const { key, globalDeps, provider } = globalService;

    (async () => {
      const dependencies = await this.resolveDependentServices(globalDeps);
      const service = await provider(dependencies);
      this.#instances.set(key, service);
    })();

    const promise = this.#instances.get(key);
    return promise as Promise<T>;
  }
}
