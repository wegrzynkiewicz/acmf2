import { ConfigGetter } from "../../../config/ConfigGetter.ts";
import { ConfigRegistry } from "../../../config/ConfigRegistry.ts";
import { GlobalService } from "../../../flux/context/GlobalService.ts";
import { ConsoleCommand } from "../../define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../define/ConsoleOutput.ts";
import { Table } from "../../runtime/Table.ts";
import { UsagePrinter } from "../../runtime/UsagePrinter.ts";
import { HelpOptions, helpOptionsLayout } from "../help/HelpCommand.ts";
import { NullArgs, nullArgsLayout } from "../null/NullArgs.ts";

export interface ConfigEntryRow {
  defaults: string;
  description: string;
  key: string;
  value: unknown;
}

export class ListConfigEntriesCommand
  extends ConsoleCommand<NullArgs, HelpOptions> {
  public constructor() {
    super({
      args: nullArgsLayout,
      description: "Display all registered config entries.",
      name: "list",
      options: helpOptionsLayout,
    });
  }

  public async execute(
    { configGetter, configRegistry, globalContext }: {
      configGetter: ConfigGetter;
      configRegistry: ConfigRegistry;
      globalContext: unknown;
    },
    { executableName, options, output }: {
      executableName: string;
      options: HelpOptions;
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
    for (const [key, variable] of entries) {
      const { description, defaults } = variable.layout;
      const row: ConfigEntryRow = {
        defaults: (defaults ?? "").toString(),
        description: description ?? "",
        key,
        value: configGetter.get(key),
      };
      table.addRow(row);
    }

    const buffer = table.getTableAsString();
    output.write(buffer);

    return 0;
  }
}

export const listConfigEntriesCommandService: GlobalService = {
  globalDeps: [],
  key: "listConfigEntriesCommand",
  provider: async () => new ListConfigEntriesCommand(),
};
