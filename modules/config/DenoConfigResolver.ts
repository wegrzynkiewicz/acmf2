import { debug } from "../debugger/debug.ts";
import { isPrimitiveLayout } from "../layout/helpers/isPrimitiveLayout.ts";
import { Layout } from "../layout/layout.ts";
import { Config } from "./Config.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { ConfigResolver } from "./ConfigResolver.ts";

export class DenoConfigResolver implements ConfigResolver {
  public async resolve(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<Config> {
    const values = new Map<string, unknown>();
    const entries = [...configRegistry.entries.entries()];
    const promises = entries.map(async (entry) => {
      const [key, layout] = entry;
      const value = await this.resolveEntry({ key, layout });
      values.set(key, value);
    });
    await Promise.all(promises);
    const config = new Config({ values });
    return config;
  }

  public async resolveEntry(
    { key, layout }: {
      key: string;
      layout: Layout;
    },
  ): Promise<unknown> {
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
