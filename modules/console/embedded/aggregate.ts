import { LayoutConsoleArguments } from "../define/argument.ts";
import { SubCommandExecutor } from "../runtime/ConsoleCommandExecutor.ts";
import { UsagePrinter } from "../runtime/UsagePrinter.ts";

export interface AggregateArgs {
  argsList?: string[];
  commandName?: string;
}

export const aggregateArgsLayout: LayoutConsoleArguments<AggregateArgs> = {
  properties: {
    commandName: {
      description: "The command to execute.",
      title: "command",
      type: "string",
    },
    argsList: {
      description: "The arguments to pass to command.",
      items: {
        type: "string",
      },
      title: "args",
      type: "array",
    },
  },
  required: {
    commandName: false,
    argsList: false,
  },
  type: "object",
};

export async function aggregateExecute(
  _globalContext: unknown,
  { args, subCommandExecutor, usagePrinter }: {
    args: AggregateArgs;
    subCommandExecutor: SubCommandExecutor,
    usagePrinter: UsagePrinter,
  },
): Promise<number> {
  const { argsList, commandName } = args;
  if (commandName === undefined || commandName === "") {
    usagePrinter.printHelp();
    return 0;
  }
  const exitCode = subCommandExecutor.executeSubCommand(commandName, argsList ?? [])
  return exitCode;
}
