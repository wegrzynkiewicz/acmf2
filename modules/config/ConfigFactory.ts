import { LayoutObject } from "../layout/layout.ts";
import { Config } from "./Config.ts";

export class ConfigFactory {
  public resolve(
    { config, layout }: {
      config: Config;
      layout: LayoutObject<unknown>;
    },
  ): unknown {
  }
}
