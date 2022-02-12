import { startUpArgsService } from "./args/StartUpArgs.ts";
import { GlobalServiceRegistry } from "./context/GlobalServiceRegistry.ts";
import { Particle } from "./particles/Particle.ts";
import { standardStreamsService } from "./streams/StandardStreams.ts";

export const fluxParticle: Particle = {
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(standardStreamsService),
      globalServiceRegistry.registerService(startUpArgsService),
    ]);
  },
};
