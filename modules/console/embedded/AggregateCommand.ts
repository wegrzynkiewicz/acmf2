import { ConsoleArgument } from "../define/ConsoleArgument.ts";
import { ConsoleCommand } from "../define/ConsoleCommand.ts";
import { ConsoleOption } from "../define/ConsoleOption.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleCommandExecutor } from "../runtime/ConsoleCommandExecutor.ts";
import { UsagePrinter } from "../runtime/UsagePrinter.ts";
import { HelpOption } from "./HelpOption.ts";

export class AggregateCommand extends ConsoleCommand {
  public constructor(
    { description, name, options }: {
      description?: string;
      name: string;
      options?: ConsoleOption[];
    },
  ) {
    super({
      args: [
        new ConsoleArgument({
          defaults: "",
          description: "The command to execute.",
          name: "command",
          required: false,
        }),
        new ConsoleArgument({
          defaults: [],
          description: "The arguments to pass to command.",
          name: "arguments",
          required: false,
          rest: true,
        }),
      ],
      description,
      name,
      options: [
        new HelpOption(),
        ...options ?? [],
      ],
    });
  }

  public async execute(
    { consoleCommandExecutor }: {
      consoleCommandExecutor: ConsoleCommandExecutor;
    },
    { args, executableName, options, output }: {
      args: Map<string, unknown>;
      executableName: string;
      options: Map<string, unknown>;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    if (options.get("help") === true) {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }
    const commandName = args.get("command") as string;
    if (commandName === "") {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }
    const command = this.getCommandByName(commandName);
    const argsList = args.get("arguments") as string[];
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: argsList,
      command,
      executableName: `${executableName} ${this.name}`,
      output,
    });
    return exitCode;
  }
}
