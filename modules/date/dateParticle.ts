import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { currentDateProviderService } from "./CurrentDateProvider.ts";

export const dateParticle: Particle = {
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(currentDateProviderService),
    ]);
  },
  name: "date",
};
