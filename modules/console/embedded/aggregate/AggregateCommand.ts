import { LayoutObject } from "../../../layout/layout.ts";
import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { ConsoleCommandExecutor } from "../../runtime/ConsoleCommandExecutor.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import {
  AggregateCommandArgumentsInput,
  aggregateCommandArgumentsInputLayout,
} from "./AggregateCommandArgumentsInput.ts";

export class AggregateCommand<
  OptionsType extends { help: boolean },
> extends ConsoleCommand<AggregateCommandArgumentsInput, OptionsType> {
  public constructor(
    { description, name, optionsLayout }: {
      description?: string;
      name: string;
      optionsLayout: LayoutObject<OptionsType>;
    },
  ) {
    super({
      argumentsLayout: aggregateCommandArgumentsInputLayout,
      description,
      name,
      optionsLayout,
    });
  }

  public async execute(
    { consoleCommandExecutor }: {
      consoleCommandExecutor: ConsoleCommandExecutor;
    },
    { args, executableName, options, output }: {
      args: AggregateCommandArgumentsInput;
      executableName: string;
      options: OptionsType;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    const { arguments: argsList, command: commandName } = args;

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
