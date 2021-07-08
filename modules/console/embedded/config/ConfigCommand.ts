import { AggregateCommand } from "../AggregateCommand.ts";

export class ConfigCommand extends AggregateCommand {
  public constructor() {
    super({
      description: "Display information about application configuration.",
      name: "config",
    });
  }
}
