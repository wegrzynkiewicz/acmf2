import { LayoutConsoleArguments } from "../../define/ConsoleArgument.ts";
import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { LayoutConsoleOptions } from "../../define/ConsoleOption.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { ConsoleCommandExecutor } from "../../runtime/ConsoleCommandExecutor.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";

export interface AggregateArgs {
  args?: string[];
  command?: string;
}

export const aggregateArgsLayout: LayoutConsoleArguments<AggregateArgs> = {
  properties: {
    command: {
      description: "The command to execute.",
      type: "string",
    },
    args: {
      description: "The arguments to pass to command.",
      items: {
        type: "string",
      },
      type: "array",
    },
  },
  required: {
    command: false,
    args: false,
  },
  type: "object",
};

export class AggregateCommand<TOptions extends { help: boolean }>
  extends ConsoleCommand<AggregateArgs, TOptions> {
  public constructor(
    { description, name, options }: {
      description?: string;
      name: string;
      options: LayoutConsoleOptions<TOptions>;
    },
  ) {
    super({
      args: aggregateArgsLayout,
      description,
      name,
      options,
    });
  }

  public async execute(
    { consoleCommandExecutor }: {
      consoleCommandExecutor: ConsoleCommandExecutor;
    },
    { args, executableName, options, output }: {
      args: AggregateArgs;
      executableName: string;
      options: TOptions;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    const { args: argsList, command: commandName } = args;

    if (options && options.help === true) {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }

    if (commandName === undefined || commandName === "") {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }

    const command = this.getCommandByName(commandName);
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: argsList ?? [],
      command,
      currentCommand: this,
      executableName: `${executableName} ${this.name}`,
      output,
    });
    return exitCode;
  }
}
