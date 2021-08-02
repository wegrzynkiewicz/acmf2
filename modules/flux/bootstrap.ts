import { createContext } from "./context/Context.ts";
import { ServiceRegistry } from "./context/ServiceRegistry.ts";
import { Particle } from "./particles/Particle.ts";
import { ParticleManager } from "./particles/ParticleManager.ts";
import { ParticleRegistry } from "./particles/ParticleRegistry.ts";

export async function bootstrap(
  { particles }: {
    particles: Particle[];
  },
): Promise<void> {
  const globalContext = createContext({ name: "globalContext" });
  const serviceRegistry = new ServiceRegistry({ context: globalContext });
  const particleRegistry = new ParticleRegistry();
  const particleManager = new ParticleManager({
    globalContext,
    particleRegistry,
  });
  serviceRegistry.registerServices({
    particleManager,
    particleRegistry,
    serviceRegistry,
  });

  for (const particle of particles) {
    await particleRegistry.registerParticle(particle);
  }
  await particleManager.run("initServices");
  await particleManager.run("execute");
}
