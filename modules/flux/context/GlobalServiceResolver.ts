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
      // TODO: Add logs
      this.#instances.set(key, service);
    })();

    const promise = this.#instances.get(key);
    return promise as Promise<T>;
  }

  public async resolveRegisteredServices(
    globalServiceRegistry: GlobalServiceRegistry,
  ): Promise<[GlobalKey, unknown][]> {
    const services = [...globalServiceRegistry.entities.values()];
    const promises = services.map((service) => this.resolveService(service));
    const whenTimeoutError = new Error();
    try {
      await Promise.race([
        Promise.all(promises),
        timeout(2000, whenTimeoutError),
      ]);
    } catch (error: unknown) {
      if (error === whenTimeoutError) {
        const keys = [...this.#instances.unresolvedKeys()].map((k) => k.toString()).join(", ");
        throw new Error(`Not all services were resolved on time (${keys})`, { cause: whenTimeoutError });
      }
      throw error;
    }
    const entries = collect(this.#instances.entries());
    return entries;
  }
}
