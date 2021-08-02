import { LayoutConfigExtractor } from "../config/LayoutConfigExtractor.ts";
import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { CurrentDateProvider } from "../useful/CurrentDateProvider.ts";
import { versionConfigLayout } from "./VersionConfig.ts";
import { VersionProvider } from "./VersionProvider.ts";

export class VersionParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const [currentDateProvider, layoutConfigExtractor] = await Promise.all([
      serviceRegistry.fetchByCreator(CurrentDateProvider),
      serviceRegistry.fetchByCreator(LayoutConfigExtractor),
    ]);
    const versionConfig = await layoutConfigExtractor.extractConfig(
      versionConfigLayout,
    );
    const versionProvider = new VersionProvider({
      currentDateProvider,
      versionConfig,
    });
    serviceRegistry.registerServices({ versionConfig, versionProvider });
  }
}
