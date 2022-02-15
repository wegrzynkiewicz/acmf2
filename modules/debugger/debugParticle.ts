import { ConfigCommand } from "../config/command/ConfigCommand.ts";
import { HelpCommand } from "../console/embedded/help/HelpCommand.ts";
import { MainCommand } from "../console/embedded/main/MainCommand.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { debugCommandService } from "./DebugCommand.ts";

export const debugParticle: Particle = {
  async assignConsoleCommands(
    { debugCommand, helpCommand, mainCommand }: {
      debugCommand: ConfigCommand;
      helpCommand: HelpCommand;
      mainCommand: MainCommand;
    },
  ): Promise<void> {
    debugCommand.assignCommand(helpCommand);
    mainCommand.assignCommand(debugCommand);
  },
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(debugCommandService),
    ]);
  },
  name: "debug",
};
