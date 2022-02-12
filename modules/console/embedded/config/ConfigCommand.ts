import { AggregateCommand } from "../aggregate/AggregateCommand.ts";
import {
  HelpCommandOptionsInput,
  helpCommandOptionsInputLayout,
  helpConsoleOption,
} from "../help/HelpCommandOptionsInput.ts";

export class ConfigCommand extends AggregateCommand<HelpCommandOptionsInput> {
  public constructor() {
    super({
      description: "Display information about application configuration.",
      name: "config",
      options: {
        help: helpConsoleOption,
      },
    });
  }
}
