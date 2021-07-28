import { debug } from "../debugger/debug.ts";
import { isPrimitiveLayout } from "../layout/helpers/isPrimitiveLayout.ts";
import { Layout } from "../layout/layout.ts";
import { Config } from "./Config.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";

export class DenoConfigResolver {
  public async resolve(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<Config> {
    const { entries } = configRegistry;
    const config = new Config({ entries });
    for (const [key, layout] of entries.entries()) {
      const value = this.resolveEntry({ key, layout });
      config.set(key, value);
    }
    return config;
  }

  public resolveEntry(
    { key, layout }: {
      key: string;
      layout: Layout;
    },
  ): unknown {
    const defaults = isPrimitiveLayout(layout) ? layout.defaults : undefined;

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
        message:
          `Resolving config entry named (${key}) with default value (${defaults}).`,
      });
      return defaults;
    }

    if (layout.type === "array") {
      debug({
        channel: "CONFIG",
        kind: "config-resolving",
        message: `Resolving config entry named (${key}) with empty array.`,
      });
      return []; // TODO:
    }

    throw new Error(`Cannot resolve config option named (${key}).`);
  }
}
