import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { DenoConfigResolver } from "./DenoConfigResolver.ts";

export class ConfigParticle implements Particle {
  public async bootstrap(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const configRegistry = new ConfigRegistry();
    serviceRegistry.registerServices({ configRegistry });
  }

  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry({
      comment: "Provides an up-to-date semver compatible version of the app.",
      defaults: "0.0.0",
      key: "APP_VERSION",
      layout: {
        type: "string",
      },
    });
    configRegistry.registerEntry({
      comment: "Provides an up-to-date revision number of the app.",
      defaults: "0000000",
      key: "APP_REVISION",
      layout: {
        type: "string",
      },
    });
  }

  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const configRegistry = await serviceRegistry.fetchByCreator(
      ConfigRegistry,
    );
    const configResolver = new DenoConfigResolver();
    const config = await configResolver.resolve({ configRegistry });

    serviceRegistry.registerServices({ config });
  }
}
