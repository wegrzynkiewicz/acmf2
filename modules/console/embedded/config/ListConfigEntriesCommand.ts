import { Config } from "../../../config/Config.ts";
import { ConfigRegistry } from "../../../config/ConfigRegistry.ts";
import { isPrimitiveLayout } from "../../../layout/helpers/isPrimitiveLayout.ts";
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
  defaults: string;
  description: string;
  key: string;
  value: unknown;
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
      options: HelpCommandOptionsInput;
      output: ConsoleOutput;
    },
  ): Promise<number> {
    if (options.help === true) {
      const usagePrinter = new UsagePrinter({ executableName, output });
      usagePrinter.writeHelp(this);
      return 0;
    }

    const headers: ConfigEntryRow = {
      defaults: "DEFAULT",
      description: "COMMENT",
      key: "ENTRY",
      value: "VALUE",
    };

    const table = new Table({
      headers,
      orders: ["key", "value", "defaults", "description"],
      showHeaders: true,
    });
    const entries = [...configRegistry.entries.entries()];
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    for (const [key, layout] of entries) {
      const { description } = layout;
      const defaults = isPrimitiveLayout(layout) ? layout.defaults : undefined;
      const row: ConfigEntryRow = {
        defaults: (defaults ?? "").toString(),
        description: description ?? "",
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
