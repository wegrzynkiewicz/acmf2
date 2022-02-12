import { debug } from "../debugger/debug.ts";
import { GlobalService } from "../flux/context/GlobalService.ts";
import { ConfigVariable } from "./ConfigVariable.ts";

export class ConfigRegistry {
  public readonly entries = new Map<string, ConfigVariable>();

  public registerEntry(variable: ConfigVariable): void {
    const { key } = variable;
    if (this.entries.has(key)) {
      throw new Error(`Configuration variable named (${key}) already exists.`);
    }
    debug({
      channel: "CONFIG",
      kind: "config-variable-registering",
      message: `Registering config key (${key}).`,
    });
    this.entries.set(key, variable);
  }
}

export const configRegistryService: GlobalService = {
  globalDeps: [],
  key: "configRegistry",
  provider: async () => new ConfigRegistry(),
};
