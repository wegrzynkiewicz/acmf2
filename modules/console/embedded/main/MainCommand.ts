import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { ConsoleCommandExecutor } from "../../runtime/ConsoleCommandExecutor.ts";
import { NullConsoleOutput } from "../../runtime/NullConsoleOutput.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import {
  AggregateCommandArgumentsInput,
  aggregateCommandArgumentsInputLayout,
} from "../aggregate/AggregateCommandArgumentsInput.ts";
import {
  MainCommandOptionsInput,
  mainCommandOptionsInputLayout,
} from "./MainCommandOptionsInput.ts";

export class MainCommand extends ConsoleCommand<
  AggregateCommandArgumentsInput,
  MainCommandOptionsInput
> {
  public constructor() {
    super({
      argumentsLayout: aggregateCommandArgumentsInputLayout,
      description: "The main build in command which execute of sub command.",
      hidden: true,
      name: "main",
      optionsLayout: mainCommandOptionsInputLayout,
    });
  }

  public async execute(
    { consoleCommandExecutor }: {
      consoleCommandExecutor: ConsoleCommandExecutor;
    },
    { args, executableName, options, output }: {
      args: AggregateCommandArgumentsInput;
      executableName: string;
      options: MainCommandOptionsInput;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    const usagePrinter = new UsagePrinter({ executableName, output });
    if (options.help === true) {
      usagePrinter.writeHelp(this);
      return 0;
    }

    if (options.quiet === true) {
      output = new NullConsoleOutput();
    }

    if (args.command === undefined) {
      usagePrinter.writeHelp(this);
      output.writeLine(
        `Type \`${executableName} help [command]\` for more information on specific commands.\n`,
      );
      return 0;
    }

    if (args.command === this.name) {
      throw new Error(`Cannot direct run a command named (${this.name}).`);
    }

    const argsList = args.arguments ?? [];
    const command = this.getCommandByName(args.command);
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: argsList,
      command,
      currentCommand: this,
      executableName,
      output,
    });
    return exitCode;
  }
}
