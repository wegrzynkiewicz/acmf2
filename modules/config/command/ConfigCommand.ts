import { AggregateCommand } from "../../console/embedded/aggregate/AggregateCommand.ts";
import { HelpOptions,helpOptionsLayout } from "../../console/embedded/help/HelpCommand.ts";
import { GlobalService } from "../../flux/context/GlobalService.ts";

export class ConfigCommand extends AggregateCommand<HelpOptions> {
  public constructor() {
    super({
      description: "Displays information about application configuration.",
      name: "config",
      options: helpOptionsLayout,
    });
  }
}

export const configCommandService: GlobalService = {
  globalDeps: [],
  key: "configCommand",
  provider: async () => new ConfigCommand(),
};
