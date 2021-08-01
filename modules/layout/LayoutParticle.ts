import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { LayoutRegister } from "./LayoutRegister.ts";

export class LayoutParticle implements Particle {
  public async bootstrap(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ) {
    const layoutRegister = new LayoutRegister();
    serviceRegistry.registerServices({ layoutRegister });
  }
}
