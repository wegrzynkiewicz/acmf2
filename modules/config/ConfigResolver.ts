import { GlobalService } from "../flux/context/GlobalService.ts";
import { ConfigGetter } from "./ConfigGetter.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { DenoConfigResolver } from "./DenoConfigResolver.ts";

export interface ConfigResolver {
  resolveConfigGetter(configRegistry: ConfigRegistry): Promise<ConfigGetter>;
}

export async function provideConfigResolver(): Promise<ConfigResolver> {
  const configResolver = new DenoConfigResolver();
  return configResolver;
}

export const configResolverService: GlobalService = {
  key: "configResolver",
  globalDeps: [],
  provider: provideConfigResolver,
};
