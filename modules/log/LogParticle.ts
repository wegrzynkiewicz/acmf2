import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { logBusService } from "./logBus/LogBus.ts";
import {
  enabledConfigVariable,
  logConfigService,
  stderrEnabledConfigVariable,
  stderrMinSeverityConfigVariable,
  stdoutEnabledConfigVariable,
  stdoutMinSeverityConfigVariable,
  tagsConfigVariable,
} from "./LogConfig.ts";
import { loggerFactoryService } from "./loggerFactory/LoggerFactory.ts";

export const logParticle: Particle = {
  async initConfigVariables(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry(enabledConfigVariable);
    configRegistry.registerEntry(tagsConfigVariable);
    configRegistry.registerEntry(stderrEnabledConfigVariable);
    configRegistry.registerEntry(stderrMinSeverityConfigVariable);
    configRegistry.registerEntry(stdoutEnabledConfigVariable);
    configRegistry.registerEntry(stdoutMinSeverityConfigVariable);
  },
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(logBusService),
      globalServiceRegistry.registerService(logConfigService),
      globalServiceRegistry.registerService(loggerFactoryService),
    ]);
  },
};
