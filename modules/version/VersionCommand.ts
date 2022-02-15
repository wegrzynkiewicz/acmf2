import { ConsoleCommand } from "../console/define/ConsoleCommand.ts";
import { ConsoleOutput } from "../console/define/ConsoleOutput.ts";
import { HelpOptions, helpOptionsLayout } from "../console/embedded/help/HelpCommand.ts";
import { NullArgs, nullArgsLayout } from "../console/embedded/null/NullArgs.ts";
import { UsagePrinter } from "../console/runtime/UsagePrinter.ts";
import { GlobalService } from "../flux/context/GlobalService.ts";
import { VersionProvider } from "./VersionProvider.ts";

export class VersionCommand extends ConsoleCommand<NullArgs, HelpOptions> {
  public constructor() {
    super({
      args: nullArgsLayout,
      aliases: ["show-version"],
      description: "Show the current version of console application.",
      name: "version",
      options: helpOptionsLayout,
    });
  }

  public async execute(
    { versionProvider }: {
      versionProvider: VersionProvider;
    },
    { executableName, options, output }: {
      executableName: string;
      options: HelpOptions;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    if (options.help === true) {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }

    const consoleVersion = await versionProvider.provideVersionInfo();
    const { version, copyright, intro, revision } = consoleVersion;
    const string = `${intro} version ${version} revision ${revision} copyright ${copyright}`;
    output.writeLine(string);

    return 0;
  }
}

export const versionCommandService: GlobalService = {
  globalDeps: [],
  key: "versionCommand",
  provider: async () => new VersionCommand(),
};
