import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { ConsoleCommandExecutor, consoleCommandExecutorService } from "./runtime/ConsoleCommandExecutor.ts";
import { consoleInputParserService } from "./runtime/ConsoleInputParser.ts";
import { StreamConsoleOutput } from "./runtime/StreamConsoleOutput.ts";
import { MainCommand, mainCommandService } from "./embedded/main/MainCommand.ts";
import { HelpCommand, helpCommandService } from "./embedded/help/HelpCommand.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";

export const consoleParticle: Particle = {
  async assignConsoleCommands(
    { helpCommand, mainCommand }: {
      helpCommand: HelpCommand;
      mainCommand: MainCommand;
    },
  ): Promise<void> {
    mainCommand.assignCommand(helpCommand);
  },
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(mainCommandService),
      globalServiceRegistry.registerService(consoleInputParserService),
      globalServiceRegistry.registerService(consoleCommandExecutorService),
      globalServiceRegistry.registerService(helpCommandService),
    ]);
  },
  async execute(
    {
      consoleCommandExecutor,
      mainCommand,
      standardStreams,
      startUpArgs,
    }: {
      consoleCommandExecutor: ConsoleCommandExecutor;
      mainCommand: MainCommand;
      standardStreams: StandardStreams;
      startUpArgs: string[];
    },
  ): Promise<void> {
    const { stderr, stdout } = standardStreams;
    const output = new StreamConsoleOutput({ stderr, stdout });
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: [...startUpArgs],
      currentCommand: mainCommand,
      command: mainCommand,
      executableName: "./console",
      output,
    });
    // TODO: return exit code
  },
  name: "console",
};
