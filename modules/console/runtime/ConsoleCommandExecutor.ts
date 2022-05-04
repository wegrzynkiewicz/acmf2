import { debug } from "../../debugger/debug.ts";
import { Context, createScopedContext } from "../../flux/context/GlobalContext.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleInputParser } from "./ConsoleInputParser.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";
import { GlobalService } from "../../flux/context/GlobalService.ts";
import { UsagePrinter } from "./UsagePrinter.ts";

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
    {
      args,
      command,
      currentCommand,
      executableName,
      output,
    }: ConsoleCommandExecutorOptions,
  ): Promise<number> => {
    const argsString = args.join(" ");
    debug({
      channel: "CONSOLE",
      kind: "console-command-executing",
      message: `Executing command (${command.name}) with (${argsString})...`,
    });
    let options: Record<string, unknown>;
    let localContext: Context;
    try {
      const parsed = consoleInputParser.parse({
        args,
        command,
      });
      options = parsed.options;
      localContext = createScopedContext();
      localContext["args"] = parsed.args;
      localContext["command"] = command;
      localContext["executableName"] = executableName;
      localContext["options"] = parsed.options;
      localContext["output"] = output;
      localContext["previousCommand"] = currentCommand;
    } catch (error: unknown) {
      if (error instanceof Error) {
        output.writeLine(error.message);
      }
      return 1;
    }

    if (options.help === true) {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(command);
      return 0;
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
