import { ConsoleCommand } from "../console/define/ConsoleCommand.ts";
import { ConsoleOutput } from "../console/define/ConsoleOutput.ts";
import { HelpOptions, helpOptionsLayout } from "../console/embedded/help/HelpCommand.ts";
import { NullArgs, nullArgsLayout } from "../console/embedded/null/NullArgs.ts";
import { VersionProvider } from "./VersionProvider.ts";

async function execute(
  { versionProvider }: {
    versionProvider: VersionProvider;
  },
  { output }: {
    output: ConsoleOutput;
  },
): Promise<number> {
  const consoleVersion = await versionProvider.provideVersionInfo();
  const { version, copyright, intro, revision } = consoleVersion;
  const string = `${intro} version ${version} revision ${revision} copyright ${copyright}`;
  output.writeLine(string);

  return 0;
}

export const versionCommand: ConsoleCommand<NullArgs, HelpOptions> = {
  args: nullArgsLayout,
  aliases: ["show-version"],
  description: "Show the current version of console application.",
  execute,
  namespaces: ["version"],
  options: helpOptionsLayout,
}
