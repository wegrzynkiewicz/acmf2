import { GlobalService } from "../flux/context/global.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { ConfigResolver } from "./ConfigResolver.ts";

export class ConfigGetter {
  readonly #values: Map<string, string>;

  public constructor(
    values: Map<string, string>,
  ) {
    this.#values = values;
  }

  public get(configKey: string): string {
    const configValue = this.#values.get(configKey);
    if (configValue === undefined) {
      throw new Error(`Cannot get config key named (${configKey}).`);
    }
    return configValue;
  }
}

export function provideConfigGetter(
  { configResolver, configRegistry }: {
    configRegistry: ConfigRegistry;
    configResolver: ConfigResolver;
  },
): Promise<ConfigGetter> {
  const configGetter = configResolver.resolveConfigGetter(configRegistry);
  return configGetter;
}

export const configGetterService: GlobalService = {
  globalDeps: ["configRegistry", "configResolver"],
  key: "configGetter",
  provider: provideConfigGetter,
};
