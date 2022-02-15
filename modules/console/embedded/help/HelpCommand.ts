import { Context } from "../../../flux/context/Context.ts";
import { GlobalService } from "../../../flux/context/GlobalService.ts";
import { LayoutConsoleArguments } from "../../define/ConsoleArgument.ts";
import { ConsoleCommand, UnknownConsoleCommand } from "../../define/ConsoleCommand.ts";
import { LayoutBooleanConsoleOption, LayoutConsoleOptions } from "../../define/ConsoleOption.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";

export interface HelpArgs {
  command: string;
}

export const helpArgsLayout: LayoutConsoleArguments<HelpArgs> = {
  properties: {
    command: {
      defaults: "",
      description: "The command whose help information will displayed.",
      type: "string",
    },
  },
  required: {
    command: false,
  },
  type: "object",
};

export interface HelpOptions {
  help: boolean;
}

export const helpOptionLayout: LayoutBooleanConsoleOption = {
  defaults: false,
  description: "Show the help information about this command.",
  longFlags: ["help"],
  shortFlags: ["h"],
  type: "boolean",
};

export const helpOptionsLayout: LayoutConsoleOptions<HelpOptions> = {
  properties: {
    help: helpOptionLayout,
  },
  type: "object",
};

export class HelpCommand extends ConsoleCommand<HelpArgs, HelpOptions> {
  public constructor() {
    super({
      args: helpArgsLayout,
      description: "Show the help information about selected command.",
      name: "help",
      options: helpOptionsLayout,
    });
  }

  public async execute(
    globalContext: Context,
    { args, executableName, options, output, previousCommand }: {
      args: HelpArgs;
      executableName: string;
      options: HelpOptions;
      output: ConsoleOutput;
      previousCommand: UnknownConsoleCommand;
    },
  ): Promise<number> {
    const usagePrinter = new UsagePrinter({ executableName, output });
    if (options.help === true || args.command === "") {
      usagePrinter.writeHelp(this);
      return 0;
    }
    const command = previousCommand.getCommandByName(args.command);
    usagePrinter.writeHelp(command);
    return 0;
  }
}

export const helpCommandService: GlobalService = {
  globalDeps: [],
  key: "helpCommand",
  provider: async () => new HelpCommand(),
};
