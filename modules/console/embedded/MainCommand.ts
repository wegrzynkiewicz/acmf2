import { ConsoleArgument } from "../define/ConsoleArgument.ts";
import { ConsoleCommand } from "../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleCommandExecutor } from "../runtime/ConsoleCommandExecutor.ts";
import { NullConsoleOutput } from "../runtime/NullConsoleOutput.ts";
import { UsagePrinter } from "../runtime/UsagePrinter.ts";
import { HelpOption } from "./HelpOption.ts";
import { QuietOption } from "./QuietOption.ts";

export class MainCommand extends ConsoleCommand {
  public constructor() {
    super({
      args: [
        new ConsoleArgument({
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
      description: "The main build in command which execute of sub command.",
      hidden: true,
      name: "main",
      options: [
        new HelpOption(),
        new QuietOption(),
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
    const usagePrinter = new UsagePrinter({ executableName, output });
    if (options.get("help") === true) {
      usagePrinter.writeHelp(this);
      return 0;
    }
    const commandName = args.get("command") as string;

    const quiet = options.get("quiet");
    if (quiet === true) {
      output = new NullConsoleOutput();
    }

    if (commandName === undefined) {
      usagePrinter.writeHelp(this);
      output.writeLine(
        `Type \`${executableName} help [command]\` for more information on specific commands.\n`,
      );
      return 0;
    }

    if (commandName === this.name) {
      throw new Error(`Cannot direct run a command named (${this.name}).`);
    }
    const argsList = (args.get("arguments") ?? []) as string[];
    const command = this.getCommandByName(commandName);
    const exitCode = await consoleCommandExecutor.executeCommand({
      args: argsList,
      command,
      executableName,
      output,
    });
    return exitCode;
  }
}
