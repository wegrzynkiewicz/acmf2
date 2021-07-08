import { ConsoleArgument } from "../define/ConsoleArgument.ts";
import { ConsoleCommand } from "../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { UsagePrinter } from "../runtime/UsagePrinter.ts";
import { HelpOption } from "./HelpOption.ts";

export class HelpCommand extends ConsoleCommand {
  public constructor() {
    super({
      args: [
        new ConsoleArgument({
          defaults: "help",
          description: "The command whose help information will displayed.",
          name: "command",
          required: false,
        }),
      ],
      description: "Show the help information about selected command.",
      name: "help",
      options: [
        new HelpOption(),
      ],
    });
  }

  public async execute(
    { commander }: {
      commander: ConsoleCommand;
    },
    { args, executableName, options, output }: {
      args: Map<string, string>;
      executableName: string;
      options: Map<string, unknown>;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    const usagePrinter = new UsagePrinter({ executableName, output });
    if (options.get("help") === true) {
      usagePrinter.writeHelp(this);
      return 0;
    }
    const commandName = args.get("command");
    if (commandName === undefined || typeof commandName !== "string") {
      throw new Error("Cannot get valid command name.");
    }
    const command = commander.getCommandByName(commandName);
    usagePrinter.writeHelp(command);
    return 0;
  }
}
