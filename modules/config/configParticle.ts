import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { configGetterService } from "./ConfigGetter.ts";
import { configRegistryService } from "./ConfigRegistry.ts";
import { configResolverService } from "./ConfigResolver.ts";

export const configParticle: Particle = {
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(configGetterService),
      globalServiceRegistry.registerService(configRegistryService),
      globalServiceRegistry.registerService(configResolverService),
    ]);
  },
};
