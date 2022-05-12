import { collect } from "../../common/async/collect.ts";
import { DeferredMap } from "../../common/async/DeferredMap.ts";
import { timeout } from "../../common/async/timeout.ts";
import { GlobalKey, GlobalService } from "./global.ts";
import { GlobalServiceRegistry } from "./GlobalServiceRegistry.ts";

export class GlobalServiceResolver {
  readonly #instances = new DeferredMap<GlobalKey, unknown>();

  public async resolveDependentServices(globalDeps: GlobalKey[]): Promise<Record<GlobalKey, unknown>> {
    const promises = globalDeps.map(async (key: GlobalKey): Promise<[GlobalKey, unknown]> => {
      const instance = await this.#instances.get(key);
      return [key, instance];
    });
    const entries = await Promise.all(promises);
    const dependencies = Object.fromEntries(entries);
    return dependencies;
  }

  public resolveService<T>(globalService: GlobalService<T>): Promise<T> {
    const { key, globalDeps, provider } = globalService;

    (async () => {
      const dependencies = await this.resolveDependentServices(globalDeps);
      const service = await provider(dependencies);
      this.#instances.set(key, service);
    })();

    const promise = this.#instances.get(key);
    return promise as Promise<T>;
  }

  public async resolveRegisteredServices(
    globalServiceRegistry: GlobalServiceRegistry,
  ): Promise<Record<GlobalKey, unknown>> {
    const services = [...globalServiceRegistry.entities.values()];
    const promises = services.map((service) => this.resolveService(service));
    try {
      await Promise.all([...promises, timeout(200)]);
    } catch (error: unknown) {
      for (const key of this.#instances.unresolvedKeys()) {
        console.log(key);
      }
    }
    const instances = await collect(this.#instances.entries());
    const record = Object.fromEntries(instances);
    return record;
  }
}
