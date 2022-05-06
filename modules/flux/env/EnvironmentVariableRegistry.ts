import { Registry } from "../../common/Registry.ts";
import { GlobalService } from "../context/global.ts";
import { EnvironmentVariable } from "./EnvironmentVariable.ts";

export type EnvironmentVariableRegistry = Registry<EnvironmentVariable>;

export const environmentVariableRegistryService: GlobalService<EnvironmentVariableRegistry> = {
  globalDeps: [],
  key: "environmentVariableRegistry",
  provider: async () => new Registry<EnvironmentVariable>(),
};
