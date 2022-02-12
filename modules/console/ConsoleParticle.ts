import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { ConfigCommand } from "./embedded/config/ConfigCommand.ts";
import { ListConfigEntriesCommand } from "./embedded/config/ListConfigEntriesCommand.ts";
import {
  ConsoleCommandExecutor,
  consoleCommandExecutorKey,
} from "./runtime/ConsoleCommandExecutor.ts";
import {
  ConsoleInputParser,
  consoleInputParserKey,
} from "./runtime/ConsoleInputParser.ts";
import { StreamConsoleOutput } from "./runtime/StreamConsoleOutput.ts";
import { commanderService, MainCommand, mainCommandKey } from "./embedded/main/MainCommand.ts";
import { HelpCommand } from "./embedded/help/HelpCommand.ts";
import { ConsoleCommand } from "./define/ConsoleCommand.ts";
import { GlobalServiceRegistry } from "../flux/context/GlobalServiceRegistry.ts";

export const consoleParticle: Particle = {
  async initGlobalServices(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ): Promise<void> {
    await Promise.all([
      globalServiceRegistry.registerService(commanderService),
    ]);
    const mainCommand = new MainCommand();
    const consoleInputParser = new ConsoleInputParser();
    const consoleCommandExecutor = new ConsoleCommandExecutor({
      consoleInputParser,
      globalContext,
    });

    serviceRegistry.registerServices({
      [mainCommandKey]: mainCommand,
      [consoleCommandExecutorKey]: consoleCommandExecutor,
      [consoleInputParserKey]: consoleInputParser,
    });

    mainCommand.registerCommand(new HelpCommand());
    const configCommand = new ConfigCommand();
    configCommand.registerCommand(new HelpCommand());
    configCommand.registerCommand(new ListConfigEntriesCommand());
    mainCommand.registerCommand(configCommand);
  }

  public async execute(
    {
      commander,
      consoleCommandExecutor,
      standardStreams,
      startUpArgs,
    }: {
      commander: ConsoleCommand;
      consoleCommandExecutor: ConsoleCommandExecutor;
      standardStreams: StandardStreams;
      startUpArgs: string[];
    },
  ): Promise<void> {
    const { stderr, stdout } = standardStreams;
    const output = new StreamConsoleOutput({ stderr, stdout });
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: [...startUpArgs],
      currentCommand: commander,
      command: commander,
      executableName: "./console",
      output,
    });
    // TODO: return exit code
  }
}
