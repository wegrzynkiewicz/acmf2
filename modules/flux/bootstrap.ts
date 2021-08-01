import { createContext } from "./context/Context.ts";
import { ServiceRegistry } from "./context/ServiceRegistry.ts";
import { Particle } from "./particles/Particle.ts";
import { ParticleManager } from "./particles/ParticleManager.ts";

export async function bootstrap(
  { particles }: {
    particles: Particle[];
  },
): Promise<void> {
  const globalContext = createContext({ name: "globalContext" });
  const serviceRegistry = new ServiceRegistry({ context: globalContext });
  const particleManager = new ParticleManager({ globalContext });
  serviceRegistry.registerServices({ particleManager, serviceRegistry });

  for (const particle of particles) {
    await particleManager.registerParticle(particle);
  }
  await particleManager.run("bootstrap");
  await particleManager.run("initConfig");
  await particleManager.run("initServices");
  await particleManager.run("initCommands");
  await particleManager.run("execute");
}
