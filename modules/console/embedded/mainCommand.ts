import { ConsoleCommand } from "../define/ConsoleCommand.ts";
import { AggregateArgs, aggregateArgsLayout, aggregateExecute } from "./aggregate.ts";
import { helpOptionLayout } from "./help.ts";
import { quietOptionLayout } from "./quietOptionLayout.ts";

export interface MainOptions {
  help: boolean;
  quiet: boolean;
}

export const mainCommand: ConsoleCommand<AggregateArgs, MainOptions> = {
  args: aggregateArgsLayout,
  description: "The main build in command which execute of sub command.",
  execute: aggregateExecute,
  hidden: true,
  key: "",
  options: {
    properties: {
      help: helpOptionLayout,
      quiet: quietOptionLayout,
    },
    type: "object",
  },
};
