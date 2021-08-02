import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { ParticleRegistry } from "./ParticleRegistry.ts";

export interface Particle {
  initParticles?: (
    { particleRegistry }: {
      particleRegistry: ParticleRegistry;
    },
  ) => Promise<void>;

  initServices?: (
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ) => Promise<void>;

  execute?: (
    globalContext: any,
  ) => Promise<void>;
}
