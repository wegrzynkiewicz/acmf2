import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { LayoutRegistry } from "./LayoutRegistry.ts";
import { LayoutResolver } from "./resolver/LayoutResolver.ts";

export class LayoutParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const layoutRegistry = new LayoutRegistry();
    const layoutResolver = new LayoutResolver();
    serviceRegistry.registerServices({ layoutRegistry, layoutResolver });
  }
}
