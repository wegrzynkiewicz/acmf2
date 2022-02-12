import { GlobalService } from "../../../flux/context/GlobalService.ts";
import { AggregateCommand } from "../aggregate/AggregateCommand.ts";
import { HelpOptions, helpOptionsLayout } from "../help/HelpCommand.ts";

export class ConfigCommand extends AggregateCommand<HelpOptions> {
  public constructor() {
    super({
      description: "Display information about application configuration.",
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
