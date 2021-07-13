import { debug } from "../../debugger/debug.ts";
import { Context, createContext } from "../../context/Context.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { AnyConsoleCommand } from "../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleInputParser } from "./ConsoleInputParser.ts";

export class ConsoleCommandExecutor {
  private readonly globalContext: Context;
  private readonly consoleInputParser: ConsoleInputParser;

  public constructor(
    { globalContext, consoleInputParser }: {
      globalContext: Context;
      consoleInputParser: ConsoleInputParser;
    },
  ) {
    this.consoleInputParser = consoleInputParser;
    this.globalContext = globalContext;
  }

  public async executeCommand(
    { args, command, currentCommand, executableName, output }: {
      args: string[];
      command: AnyConsoleCommand;
      currentCommand: AnyConsoleCommand;
      executableName: string;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    const argsString = args.join(" ");
    debug({
      channel: "CONSOLE",
      kind: "console-command-executing",
      message: `Executing command (${command.name}) with (${argsString})...`,
    });
    const { globalContext, consoleInputParser } = this;

    let localContext: Context;
    try {
      const { argsInput, optionsInput } = consoleInputParser.parse({
        args,
        command,
      });
      localContext = createContext({ name: "localContext" });
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
  }
}
