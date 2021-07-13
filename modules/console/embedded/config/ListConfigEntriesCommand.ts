import { Config } from "../../../config/Config.ts";
import { ConfigRegistry } from "../../../config/ConfigRegistry.ts";
import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { Table } from "../../runtime/Table.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import {
  HelpCommandOptionsInput,
  helpCommandOptionsInputLayout,
} from "../help/HelpCommandOptionsInput.ts";
import {
  NullCommandArgumentsInput,
  nullCommandArgumentsInputLayout,
} from "../null/NullCommandArgumentsInput.ts";

export interface ConfigEntryRow {
  comment: string;
  defaults: string;
  key: string;
  value: string;
}

export class ListConfigEntriesCommand
  extends ConsoleCommand<NullCommandArgumentsInput, HelpCommandOptionsInput> {
  public constructor() {
    super({
      argumentsLayout: nullCommandArgumentsInputLayout,
      description: "Display all registered config entries.",
      name: "list",
      optionsLayout: helpCommandOptionsInputLayout,
    });
  }

  public async execute(
    { config, configRegistry }: {
      config: Config;
      configRegistry: ConfigRegistry;
    },
    { executableName, options, output }: {
      executableName: string;
      options: Map<string, unknown>;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    if (options.get("help") === true) {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }

    const headers: ConfigEntryRow = {
      comment: "COMMENT",
      defaults: "DEFAULT",
      key: "ENTRY",
      value: "VALUE",
    };

    const table = new Table({
      headers,
      orders: ["key", "value", "defaults", "comment"],
      showHeaders: true,
    });
    const entries = [...configRegistry.entries.values()];
    entries.sort((a, b) => a.key.localeCompare(b.key));
    for (const entry of entries) {
      const { comment, defaults, key } = entry;
      const row: ConfigEntryRow = {
        comment: comment ?? "",
        defaults: defaults ?? "",
        key,
        value: config.get(key),
      };
      table.addRow(row);
    }

    const buffer = table.getTableAsString();
    output.write(buffer);

    return 0;
  }
}
