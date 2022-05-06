import { ConsoleCommand } from "../../console/define/ConsoleCommand.ts";
import { AggregateArgs, aggregateArgsLayout, aggregateExecute } from "../../console/embedded/aggregate.ts";
import { HelpOptions, helpOptionsLayout } from "../../console/embedded/help/HelpCommand.ts";

export const debugCommand: ConsoleCommand<AggregateArgs, HelpOptions> = {
  args: aggregateArgsLayout,
  description: "Displays the application debugging tool.",
  execute: aggregateExecute,
  namespaces: ["version"],
  options: helpOptionsLayout,
}
