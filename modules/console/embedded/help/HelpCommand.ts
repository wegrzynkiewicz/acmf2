import { Context } from "../../../context/Context.ts";
import {
  AnyConsoleCommand,
  ConsoleCommand,
} from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import {
  HelpCommandArgumentsInput,
  helpCommandArgumentsInputLayout,
} from "./HelpCommandArgumentsInput.ts";
import {
  HelpCommandOptionsInput,
  helpCommandOptionsInputLayout,
} from "./HelpCommandOptionsInput.ts";

export class HelpCommand
  extends ConsoleCommand<HelpCommandArgumentsInput, HelpCommandOptionsInput> {
  public constructor() {
    super({
      argumentsLayout: helpCommandArgumentsInputLayout,
      description: "Show the help information about selected command.",
      name: "help",
      optionsLayout: helpCommandOptionsInputLayout,
    });
  }

  public async execute(
    globalContext: Context,
    { args, executableName, options, output, previousCommand }: {
      args: HelpCommandArgumentsInput;
      executableName: string;
      options: HelpCommandOptionsInput;
      output: ConsoleOutput;
      previousCommand: AnyConsoleCommand;
    },
  ): Promise<number> {
    const usagePrinter = new UsagePrinter({ executableName, output });
    if (options.help === true) {
      usagePrinter.writeHelp(this);
      return 0;
    }
    const command = previousCommand.getCommandByName(args.command);
    usagePrinter.writeHelp(command);
    return 0;
  }
}
