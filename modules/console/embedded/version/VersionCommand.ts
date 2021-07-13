import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { ConsoleVersionProvider } from "./ConsoleVersionProvider.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import {
  HelpCommandOptionsInput,
  helpCommandOptionsInputLayout,
} from "../help/HelpCommandOptionsInput.ts";
import {
  NullCommandArgumentsInput,
  nullCommandArgumentsInputLayout,
} from "../null/NullCommandArgumentsInput.ts";

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
    { consoleVersionProvider }: {
      consoleVersionProvider: ConsoleVersionProvider;
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

    const consoleVersion = await consoleVersionProvider.provide();
    const { version, copyright, intro, revision } = consoleVersion;
    const string =
      `${intro} version ${version} revision ${revision} copyright ${copyright}`;
    output.writeLine(string);

    return 0;
  }
}
