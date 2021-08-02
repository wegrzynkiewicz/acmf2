import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { ExitCodeManager } from "../flux/ExitCodeManager.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { ConfigCommand } from "./embedded/config/ConfigCommand.ts";
import { ListConfigEntriesCommand } from "./embedded/config/ListConfigEntriesCommand.ts";
import { ConsoleCommandExecutor } from "./runtime/ConsoleCommandExecutor.ts";
import { ConsoleInputParser } from "./runtime/ConsoleInputParser.ts";
import { StreamConsoleOutput } from "./runtime/StreamConsoleOutput.ts";
import { Context } from "../flux/context/Context.ts";
import { MainCommand } from "./embedded/main/MainCommand.ts";
import { HelpCommand } from "./embedded/help/HelpCommand.ts";
import { ConsoleCommand } from "./define/ConsoleCommand.ts";

export class ConsoleParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const [globalContext] = await Promise.all([
      serviceRegistry.fetchByName<Context>("globalContext"),
    ]);
    const commander = new MainCommand();
    const consoleInputParser = new ConsoleInputParser();
    const consoleCommandExecutor = new ConsoleCommandExecutor({
      consoleInputParser,
      globalContext,
    });

    serviceRegistry.registerServices({
      commander,
      consoleCommandExecutor,
      consoleInputParser,
    });

    commander.registerCommand(new HelpCommand());
    const configCommand = new ConfigCommand();
    configCommand.registerCommand(new HelpCommand());
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
      currentCommand: commander,
      command: commander,
      executableName: "./console",
      output,
    });
    exitCodeManager.set(exitCode);
  }
}
