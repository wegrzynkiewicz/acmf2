import { AggregateCommand } from "../../console/embedded/aggregate/AggregateCommand.ts";
import { HelpOptions, helpOptionsLayout } from "../../console/embedded/help/HelpCommand.ts";
import { GlobalService } from "../../flux/context/global.ts";

export class DebugCommand extends AggregateCommand<HelpOptions> {
  public constructor() {
    super({
      description: "Displays the application debugging tool.",
      name: "debug",
      options: helpOptionsLayout,
    });
  }
}

export const debugCommandService: GlobalService = {
  globalDeps: [],
  key: "debugCommand",
  provider: async () => new DebugCommand(),
};
