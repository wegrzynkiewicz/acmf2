import { ConsoleCommand } from "../console/define/ConsoleCommand.ts";
import { ConsoleOutput } from "../console/define/ConsoleOutput.ts";
import {
  HelpCommandOptionsInput,
  helpCommandOptionsInputLayout,
} from "../console/embedded/help/HelpCommandOptionsInput.ts";
import {
  NullCommandArgumentsInput,
  nullCommandArgumentsInputLayout,
} from "../console/embedded/null/NullCommandArgumentsInput.ts";
import { UsagePrinter } from "../console/runtime/UsagePrinter.ts";
import { VersionProvider } from "./VersionProvider.ts";

export class VersionCommand
  extends ConsoleCommand<NullCommandArgumentsInput, HelpCommandOptionsInput> {
  public constructor() {
    super({
      argumentsLayout: nullCommandArgumentsInputLayout,
      aliases: ["show-version"],
      description: "Show the current version of console application.",
      name: "version",
      optionsLayout: helpCommandOptionsInputLayout,
    });
  }

  public async execute(
    { versionProvider }: {
      versionProvider: VersionProvider;
    },
    { executableName, options, output }: {
      executableName: string;
      options: HelpCommandOptionsInput;
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
    const string =
      `${intro} version ${version} revision ${revision} copyright ${copyright}`;
    output.writeLine(string);

    return 0;
  }
}
