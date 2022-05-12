import { debug } from "../../debugger/debug.ts";
import { GlobalContext } from "../../flux/context/global.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleInputParser, ParsedInput } from "./ConsoleInputParser.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";
import { GlobalService } from "../../flux/context/global.ts";
import { createScopedContext } from "../../flux/context/scoped.ts";
import { ConsoleCommandRegistry } from "./ConsoleCommandRegistry.ts";
import { NullConsoleOutput } from "./NullConsoleOutput.ts";
import { writeHelp } from "./UsagePrinter.ts";

export interface ConsoleCommandExecutorOptions {
  args: string[];
  command: UnknownConsoleCommand;
  currentCommand: UnknownConsoleCommand;
  output: ConsoleOutput;
}

export interface ConsoleCommandExecutor {
  executeCommand(options: ConsoleCommandExecutorOptions): Promise<number>;
}

export interface SubCommandExecutor {
  executeSubCommand(commandName: string, args: string[]): Promise<number>;
}

export async function provideConsoleCommandExecutor(
  { globalContext, consoleCommandRegistry, consoleInputParser }: {
    globalContext: GlobalContext;
    consoleCommandRegistry: ConsoleCommandRegistry;
    consoleInputParser: ConsoleInputParser;
  },
): Promise<ConsoleCommandExecutor> {
  const executeCommand = async (
    {
      args,
      command,
      currentCommand,
      output,
    }: ConsoleCommandExecutorOptions,
  ): Promise<number> => {
    const argsString = args.join(" ");
    debug({
      channel: "CONSOLE",
      kind: "console-command-executing",
      message: `Executing command (${command.key}) with (${argsString})...`,
    });

    let parsed: ParsedInput;
    try {
      parsed = consoleInputParser.parse({
        args,
        command,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        output.writeLine(error.message);
      }
      return 1;
    }

    if (command.options.properties.quiet && parsed.options.quiet === true) {
      output = new NullConsoleOutput();
    }

    const { entities } = consoleCommandRegistry;
    const childrenCommands = [...entities.keys()]
      .filter((k) => k.toString().startsWith(`${command.key}:`))
      .map((k) => entities.get(k)!);

    const printHelp = (): void => {
      writeHelp({ childrenCommands, command, output });
    };

    const executeSubCommand = async (commandName: string, args: string[]): Promise<number> => {
      const commandKey = `${currentCommand.key}:${commandName}`;
      const command = childrenCommands.find((e) => e.key === commandKey);
      if (command === undefined) {
        throw new Breaker({
          kind: "console-command-missing",
          message: `Console command with key (${commandKey}) not exists.`,
          status: 1,
        });
      }
      const exitCode = await executeCommand({
        args,
        command,
        currentCommand,
        output,
      });
      return exitCode;
    };

    if (command.options.properties.help && parsed.options.help === true) {
      printHelp();
      return 0;
    }

    const localContext = createScopedContext();
    localContext["args"] = parsed.args;
    localContext["currentCommand"] = command;
    localContext["subCommandExecutor"] = {executeSubCommand};
    localContext["options"] = parsed.options;
    localContext["output"] = output;
    localContext["previousCommand"] = currentCommand;
    localContext["printHelp"] = printHelp;

    try {
      const result = await command.execute(globalContext, localContext);
      if (typeof result === "number") {
        return result;
      }
      return 0;
    } catch (error: unknown) {
      if (error instanceof Breaker) {
        output.error(error);
        return error.status;
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Breaker({
        error,
        kind: "console-unexpected-error",
        message: "Unexpected console command error.",
        status: 1,
      });
    }
  };
  return { executeCommand };
}

export const consoleCommandExecutorService: GlobalService = {
  globalDeps: ["globalContext", "consoleCommandRegistry", "consoleInputParser"],
  key: "consoleCommandExecutor",
  provider: provideConsoleCommandExecutor,
};
