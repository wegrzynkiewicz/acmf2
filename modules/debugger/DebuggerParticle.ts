import { ConfigResolver } from "../config/ConfigResolver.ts";
import { LayoutConfigExtractor } from "../config/LayoutConfigExtractor.ts";
import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { debugConfigLayout } from "./DebugConfig.ts";

export class DebuggerParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const layoutConfigExtractor = await serviceRegistry.fetchByCreator(
      LayoutConfigExtractor,
    );
    const debugConfig = await layoutConfigExtractor.extractConfig(
      debugConfigLayout,
    );
    serviceRegistry.registerServices({ debugConfig });
  }
}
