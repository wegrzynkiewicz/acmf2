import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { CurrentDateProvider } from "../useful/CurrentDateProvider.ts";
import { VersionConfig, versionConfigLayout } from "./VersionConfig.ts";
import { VersionProvider } from "./VersionProvider.ts";

export class VersionParticle implements Particle {
  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntriesFromLayout(versionConfigLayout);
  }

  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const [currentDateProvider, versionConfig] = await Promise.all([
      serviceRegistry.fetchByCreator(CurrentDateProvider),
      serviceRegistry.fetchByName<VersionConfig>("versionConfig"),
    ]);
    const versionProvider = new VersionProvider({
      currentDateProvider,
      versionConfig,
    });
    serviceRegistry.registerServices({ versionProvider });
  }
}
