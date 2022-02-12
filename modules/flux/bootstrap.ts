import { configRegistryService } from "../config/ConfigRegistry.ts";
import { createGlobalContext } from "./context/Context.ts";
import { GlobalServiceRegistry } from "./context/GlobalServiceRegistry.ts";
import { Particle } from "./particles/Particle.ts";
import {
  ParticleManager,
  particleManagerService,
} from "./particles/ParticleManager.ts";
import {
  ParticleRegistry,
  particleRegistryService,
} from "./particles/ParticleRegistry.ts";

export async function bootstrap(
  { particles }: {
    particles: Particle[];
  },
): Promise<void> {
  const globalContext = createGlobalContext();
  const serviceRegistry = new GlobalServiceRegistry({ context: globalContext });
  await serviceRegistry.registerService({
    globalDeps: [],
    key: "globalServiceRegistry",
    provider: async () => serviceRegistry,
  });
  const particleRegistry = await serviceRegistry.registerService<
    ParticleRegistry
  >(particleRegistryService);
  const particleManager = await serviceRegistry.registerService<
    ParticleManager
  >(particleManagerService);
  await serviceRegistry.registerService(configRegistryService);

  for (const particle of particles) {
    await particleRegistry.registerParticle(particle);
  }
  await particleManager.run("initConfigVariables");
  await particleManager.run("initGlobalServices");
  await particleManager.run("execute");
}
