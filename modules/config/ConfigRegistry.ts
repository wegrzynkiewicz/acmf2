import { Registry } from "../common/Registry.ts";
import { GlobalService } from "../flux/context/global.ts";
import { ConfigVariable } from "./ConfigVariable.ts";

export type ConfigRegistry = Registry<ConfigVariable>;

export const configRegistryService: GlobalService = {
  globalDeps: [],
  key: "configRegistry",
  provider: async () => new Registry<ConfigVariable>(),
};
