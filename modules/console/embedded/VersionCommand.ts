import { ConsoleCommand } from "../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";
import { ConsoleVersionProvider } from "../runtime/ConsoleVersionProvider.ts";
import { UsagePrinter } from "../runtime/UsagePrinter.ts";
import { HelpOption } from "./HelpOption.ts";

export class VersionCommand extends ConsoleCommand {
  public constructor() {
    super({
      aliases: ["show-version"],
      description: "Show the current version of console application.",
      name: "version",
      options: [
        new HelpOption(),
      ],
    });
  }

  public async execute(
    { consoleVersionProvider }: {
      consoleVersionProvider: ConsoleVersionProvider;
    },
    { executableName, options, output }: {
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

    const consoleVersion = await consoleVersionProvider.provide();
    const { version, copyright, intro, revision } = consoleVersion;
    const string =
      `${intro} version ${version} revision ${revision} copyright ${copyright}`;
    output.writeLine(string);

    return 0;
  }
}
