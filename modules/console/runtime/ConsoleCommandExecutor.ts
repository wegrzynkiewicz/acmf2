import { debug } from "../../debugger/debug.ts";
import { Context, createScopedContext } from "../../flux/context/Context.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleInputParser } from "./ConsoleInputParser.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";
import { GlobalService } from "../../flux/context/GlobalService.ts";

export interface ConsoleCommandExecutorOptions {
  args: string[];
  command: UnknownConsoleCommand;
  currentCommand: UnknownConsoleCommand;
  executableName: string;
  output: ConsoleOutput;
}

export interface ConsoleCommandExecutor {
  executeCommand(options: ConsoleCommandExecutorOptions): Promise<number>;
}

export async function provideConsoleCommandExecutor(
  { globalContext, consoleInputParser }: {
    globalContext: Context;
    consoleInputParser: ConsoleInputParser;
  },
): Promise<ConsoleCommandExecutor> {
  const executeCommand = async (
    { args, command, currentCommand, executableName, output }:
      ConsoleCommandExecutorOptions,
  ): Promise<number> => {
    const argsString = args.join(" ");
    debug({
      channel: "CONSOLE",
      kind: "console-command-executing",
      message: `Executing command (${command.name}) with (${argsString})...`,
    });
    let localContext: Context;
    try {
      const { argsInput, optionsInput } = consoleInputParser.parse({
        args,
        command,
      });
      localContext = createScopedContext();
      localContext["args"] = argsInput;
      localContext["command"] = command;
      localContext["executableName"] = executableName;
      localContext["options"] = optionsInput;
      localContext["output"] = output;
      localContext["previousCommand"] = currentCommand;
    } catch (error: unknown) {
      if (error instanceof Error) {
        output.writeLine(error.message);
      }
      return 1;
    }

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
  globalDeps: ["globalContext", "consoleInputParser"],
  key: "consoleCommandExecutor",
  provider: provideConsoleCommandExecutor,
};
