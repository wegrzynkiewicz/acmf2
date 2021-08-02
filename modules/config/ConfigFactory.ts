import { Config } from "./Config.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { ConfigResolver } from "./ConfigResolver.ts";

export class ConfigFactory {
  private readonly configRegistry: ConfigRegistry;
  private readonly configResolver: ConfigResolver;

  public constructor(
    { configRegistry, configResolver }: {
      configRegistry: ConfigRegistry;
      configResolver: ConfigResolver;
    },
  ) {
    this.configRegistry = configRegistry;
    this.configResolver = configResolver;
  }

  public async createConfig(): Promise<Config> {
    const { configRegistry, configResolver } = this;
    const config = await configResolver.resolve({ configRegistry });
    return config;
  }
}
