import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { ConfigFactory } from "./ConfigFactory.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { DenoConfigResolver } from "./DenoConfigResolver.ts";
import { LayoutConfigExtractor } from "./LayoutConfigExtractor.ts";

export class ConfigParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const configRegistry = new ConfigRegistry();
    const configResolver = new DenoConfigResolver();
    const configFactory = new ConfigFactory({
      configRegistry,
      configResolver,
    });
    const layoutConfigExtractor = new LayoutConfigExtractor({
      configRegistry,
      configResolver,
    });
    serviceRegistry.registerServices({
      configFactory,
      configRegistry,
      configResolver,
      layoutConfigExtractor,
    });
  }
}
