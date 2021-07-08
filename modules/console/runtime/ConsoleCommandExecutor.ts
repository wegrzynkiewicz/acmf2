import { debug } from "../../debugger/debug.ts";
import { Context, createContext } from "../../context/Context.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { ConsoleCommand } from "../define/ConsoleCommand.ts";
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
    { args, command, executableName, output }: {
      args: string[];
      command: ConsoleCommand;
      executableName: string;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    debug({
      kind: "console-command-executing",
      message: `Executing command (${command.name}) with (${
        args.join(" ")
      })...`,
    });
    const { globalContext, consoleInputParser } = this;

    let localContext: Context;
    try {
      const { args: argsList, options } = consoleInputParser.parse({
        args,
        command,
      });
      localContext = createContext({ name: "localContext" });
      localContext["args"] = argsList;
      localContext["command"] = command;
      localContext["executableName"] = executableName;
      localContext["options"] = options;
      localContext["output"] = output;
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
        return error.status;
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Breaker({
        error,
        kind: "Unexpected console command error",
        status: 1,
      });
    }
  }
}
