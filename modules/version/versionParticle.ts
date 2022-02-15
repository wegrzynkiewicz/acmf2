import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { MainCommand } from "../console/embedded/main/MainCommand.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { VersionCommand, versionCommandService } from "./VersionCommand.ts";
import { appVersionVariable, versionConfigService } from "./VersionConfig.ts";
import { appRevisionVariable } from "./VersionConfig.ts";
import { versionProviderService } from "./VersionProvider.ts";

export const versionParticle: Particle = {
  async assignConsoleCommands(
    { mainCommand, versionCommand }: {
      mainCommand: MainCommand;
      versionCommand: VersionCommand;
    },
  ): Promise<void> {
    mainCommand.assignCommand(versionCommand);
  },
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
    await Promise.all([
      globalServiceRegistry.registerService(versionConfigService),
      globalServiceRegistry.registerService(versionProviderService),
      globalServiceRegistry.registerService(versionCommandService),
    ]);
  },
  name: "version",
};
