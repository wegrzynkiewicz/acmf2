import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { CurrentDateProvider } from "./CurrentDateProvider.ts";

export class UsefulParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const currentDateProvider = new CurrentDateProvider();
    serviceRegistry.registerServices({ currentDateProvider });
  }
}
