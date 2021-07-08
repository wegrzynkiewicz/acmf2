import { debug } from "../debugger/debug.ts";
import { Config } from "./Config.ts";
import { ConfigEntry } from "./ConfigEntry.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";

export class DenoConfigResolver {
  public async resolve(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<Config> {
    const { entries } = configRegistry;
    const config = new Config({ entries });
    for (const entry of entries.values()) {
      const value = this.resolveEntry(entry);
      config.set(entry.key, value);
    }
    return config;
  }

  public resolveEntry(entry: ConfigEntry): string {
    const { defaults, key } = entry;

    let value: string | undefined = undefined;
    try {
      value = Deno.env.get(key);
    } catch (error: unknown) {
      if (defaults === undefined) {
        throw error;
      }
    }

    if (value !== undefined) {
      debug({
        kind: "config-resolving",
        message: `Resolving config entry named (${key}) with value (${value}).`,
      });
      return value;
    }

    if (defaults !== undefined) {
      debug({
        kind: "config-resolving",
        message:
          `Resolving config entry named (${key}) with default value (${defaults}).`,
      });
      return defaults;
    }

    throw new Error(`Cannot resolve config option named (${key}).`);
  }
}
