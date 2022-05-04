import { debug } from "../debugger/debug.ts";
import { ConfigGetter } from "./ConfigGetter.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { ConfigResolver } from "./ConfigResolver.ts";
import { ConfigVariable } from "./ConfigVariable.ts";

export class DenoConfigResolver implements ConfigResolver {
  public async resolveConfigGetter(
    configRegistry: ConfigRegistry,
  ): Promise<ConfigGetter> {
    const values = new Map<string, string>();
    for (const variable of configRegistry.entries.values()) {
      const { key } = variable;
      const value = this.resolveEntry(variable);
      values.set(key, value);
    }
    const config = new ConfigGetter(values);
    return config;
  }

  public resolveEntry(variable: ConfigVariable): string {
    const { key, layout } = variable;
    const { defaults } = layout;
    let value: string | undefined = undefined;
    try {
      value = Deno.env.get(key);
    } catch (error: unknown) {
      if (defaults === undefined) {
        throw new Error(`Cannot resolve config variable named (${key}).`, {
          cause: error instanceof Error ? error : undefined,
        });
      }
    }

    if (value !== undefined) {
      debug({
        channel: "CONFIG",
        kind: "config-resolving",
        message: `Resolving config entry named (${key}) with value (${value}).`,
      });
      return value;
    }

    if (defaults !== undefined) {
      debug({
        channel: "CONFIG",
        kind: "config-resolving",
        message: `Resolving config entry named (${key}) with default value (${defaults}).`,
      });
      return defaults;
    }

    throw new Error(`Cannot resolve config variable named (${key}).`);
  }
}
