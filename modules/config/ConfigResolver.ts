import { Layout } from "../layout/layout.ts";
import { Config } from "./Config.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";

export interface ConfigResolver {
  resolve(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<Config>;

  resolveEntry(
    { key, layout }: {
      key: string;
      layout: Layout;
    },
  ): Promise<unknown>;
}
