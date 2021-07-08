import { Config } from "../config/Config.ts";
import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { ExitCodeManager } from "../flux/ExitCodeManager.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { ConsoleCommand } from "./define/ConsoleCommand.ts";
import { ConfigCommand } from "./embedded/config/ConfigCommand.ts";
import { ListConfigEntriesCommand } from "./embedded/config/ListConfigEntriesCommand.ts";
import { HelpCommand } from "./embedded/HelpCommand.ts";
import { MainCommand } from "./embedded/MainCommand.ts";
import { VersionCommand } from "./embedded/VersionCommand.ts";
import { ConsoleCommandExecutor } from "./runtime/ConsoleCommandExecutor.ts";
import { ConsoleInputParser } from "./runtime/ConsoleInputParser.ts";
import { ConsoleVersionProvider } from "./runtime/ConsoleVersionProvider.ts";
import { StreamConsoleOutput } from "./runtime/StreamConsoleOutput.ts";
import { Context } from "../context/Context.ts";

export class ConsoleParticle implements Particle {
  public async initServices(
    { globalContext, serviceRegistry }: {
      globalContext: Context;
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const commander = new MainCommand();

    const consoleInputParser = new ConsoleInputParser();
    const consoleCommandExecutor = new ConsoleCommandExecutor({
      consoleInputParser,
      globalContext,
    });
    const config = await serviceRegistry.fetchByCreator(Config);

    const consoleVersionProvider = new ConsoleVersionProvider({ config });

    serviceRegistry.registerServices({
      commander,
      consoleCommandExecutor,
      consoleInputParser,
      consoleVersionProvider,
    });
  }

  public async initCommands(
    { commander }: {
      commander: ConsoleCommand;
    },
  ): Promise<void> {
    commander.registerCommand(new VersionCommand());
    commander.registerCommand(new HelpCommand());

    const configCommand = new ConfigCommand();
    configCommand.registerCommand(new ListConfigEntriesCommand());

    commander.registerCommand(configCommand);
  }

  public async execute(
    {
      commander,
      consoleCommandExecutor,
      exitCodeManager,
      standardStreams,
      startUpArgs,
    }: {
      commander: ConsoleCommand;
      consoleCommandExecutor: ConsoleCommandExecutor;
      exitCodeManager: ExitCodeManager;
      standardStreams: StandardStreams;
      startUpArgs: string[];
    },
  ): Promise<void> {
    const { stderr, stdout } = standardStreams;
    const output = new StreamConsoleOutput({ stderr, stdout });
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: [...startUpArgs],
      command: commander,
      executableName: "./console",
      output,
    });
    exitCodeManager.set(exitCode);
  }
}
