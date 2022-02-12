import { GlobalService } from "../../../flux/context/GlobalService.ts";
import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { ConsoleCommandExecutor } from "../../runtime/ConsoleCommandExecutor.ts";
import { NullConsoleOutput } from "../../runtime/NullConsoleOutput.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import {
  AggregateArgs,
  aggregateArgsLayout,
} from "../aggregate/AggregateCommand.ts";
import { helpOptionLayout } from "../help/HelpCommand.ts";
import { quietOptionLayout } from "../quiet/quietOptionLayout.ts";

export interface MainOptions {
  help: boolean;
  quiet: boolean;
}

export class MainCommand extends ConsoleCommand<AggregateArgs, MainOptions> {
  public constructor() {
    super({
      args: aggregateArgsLayout,
      description: "The main build in command which execute of sub command.",
      hidden: true,
      name: "main",
      options: {
        properties: {
          help: helpOptionLayout,
          quiet: quietOptionLayout,
        },
        type: "object",
      },
    });
  }

  public async execute(
    { consoleCommandExecutor }: {
      consoleCommandExecutor: ConsoleCommandExecutor;
    },
    { args, executableName, options, output }: {
      args: AggregateArgs;
      executableName: string;
      options: MainOptions;
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

    if (args.command === undefined || args.command === "") {
      usagePrinter.writeHelp(this);
      output.writeLine(
        `Type \`${executableName} help [command]\` for more information on specific commands.\n`,
      );
      return 0;
    }

    if (args.command === this.name) {
      throw new Error(`Cannot direct run a command named (${this.name}).`);
    }

    const argsList = args.args ?? [];
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

export const commanderService: GlobalService = {
  globalDeps: [],
  key: "commander",
  provider: async () => new MainCommand(),
};
