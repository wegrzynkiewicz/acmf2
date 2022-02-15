import { ConsoleCommand } from "../../console/define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../console/define/ConsoleOutput.ts";
import { HelpOptions,helpOptionsLayout } from "../../console/embedded/help/HelpCommand.ts";
import { NullArgs,nullArgsLayout } from "../../console/embedded/null/NullArgs.ts";
import { Table } from "../../console/runtime/Table.ts";
import { UsagePrinter } from "../../console/runtime/UsagePrinter.ts";
import { GlobalService } from "../../flux/context/GlobalService.ts";
import { ConfigGetter } from "../ConfigGetter.ts";
import { ConfigRegistry } from "../ConfigRegistry.ts";

export interface ConfigEntryRow {
  defaults: string;
  description: string;
  key: string;
  value: unknown;
}

export class ListConfigEntriesCommand extends ConsoleCommand<NullArgs, HelpOptions> {
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
