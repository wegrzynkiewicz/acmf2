import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { appVersionVariable, versionConfigService } from "./VersionConfig.ts";
import { appRevisionVariable } from "./VersionConfig.ts";
import { versionProviderService } from "./VersionProvider.ts";

export const versionParticle: Particle = {
  async initConfigVariables(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry(appRevisionVariable);
    configRegistry.registerEntry(appVersionVariable);
  },
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await globalServiceRegistry.registerService(versionConfigService);
    await globalServiceRegistry.registerService(versionProviderService);
  },
};
