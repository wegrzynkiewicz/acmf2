import { HelpCommand } from "../console/embedded/help/HelpCommand.ts";
import { MainCommand } from "../console/embedded/main/MainCommand.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { ConfigCommand, configCommandService } from "./command/ConfigCommand.ts";
import { ListConfigEntriesCommand, listConfigEntriesCommandService } from "./command/ListConfigEntriesCommand.ts";
import { configGetterService } from "./ConfigGetter.ts";
import { configResolverService } from "./ConfigResolver.ts";

export const configParticle: Particle = {
  async assignConsoleCommands(
    { configCommand, helpCommand, listConfigEntriesCommand, mainCommand }: {
      configCommand: ConfigCommand;
      helpCommand: HelpCommand;
      listConfigEntriesCommand: ListConfigEntriesCommand;
      mainCommand: MainCommand;
    },
  ): Promise<void> {
    configCommand.assignCommand(helpCommand);
    configCommand.assignCommand(listConfigEntriesCommand);
    mainCommand.assignCommand(configCommand);
  },
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(configGetterService),
      // globalServiceRegistry.registerService(configRegistryService),
      globalServiceRegistry.registerService(configResolverService),
      globalServiceRegistry.registerService(configCommandService),
      globalServiceRegistry.registerService(listConfigEntriesCommandService),
    ]);
  },
  name: "config",
};
