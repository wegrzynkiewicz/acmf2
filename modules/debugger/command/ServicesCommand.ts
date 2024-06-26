import { AggregateCommand } from "../../console/embedded/AggregateCommand.ts";
import { HelpOptions, helpOptionsLayout } from "../../console/embedded/help/HelpCommand.ts";
import { GlobalService } from "../../flux/context/global.ts";

export class ServicesCommand extends AggregateCommand<HelpOptions> {
  public constructor() {
    super({
      description: "Displays information about services in application.",
      name: "services",
      options: helpOptionsLayout,
    });
  }
}

export const servicesCommandService: GlobalService = {
  globalDeps: [],
  key: "servicesCommand",
  provider: async () => new ServicesCommand(),
};
