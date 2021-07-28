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
