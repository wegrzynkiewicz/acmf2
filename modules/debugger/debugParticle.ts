import { ConfigCommand } from "../config/command/ConfigCommand.ts";
import { HelpCommand } from "../console/embedded/help/HelpCommand.ts";
import { MainCommand } from "../console/embedded/main/MainCommand.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { ServicesCommand, servicesCommandService } from "./command/ServicesCommand.ts";
import { debugCommandService } from "./command/DebugCommand.ts";
import { ServicesListCommand, servicesListCommandService } from "./command/ServicesListCommand.ts";

export const debugParticle: Particle = {
  async assignConsoleCommands(
    { debugCommand, helpCommand, mainCommand, servicesCommand, servicesListCommand }: {
      debugCommand: ConfigCommand;
      helpCommand: HelpCommand;
      mainCommand: MainCommand;
      servicesCommand: ServicesCommand;
      servicesListCommand: ServicesListCommand;
    },
  ): Promise<void> {
    debugCommand.assignCommand(helpCommand);
    debugCommand.assignCommand(servicesCommand);
    servicesCommand.assignCommand(servicesListCommand);
    mainCommand.assignCommand(debugCommand);
  },
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(debugCommandService),
      globalServiceRegistry.registerService(servicesCommandService),
      globalServiceRegistry.registerService(servicesListCommandService),
    ]);
  },
  name: "debug",
};
