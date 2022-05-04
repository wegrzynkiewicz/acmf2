import { ConsoleCommand } from "../../console/define/ConsoleCommand.ts";
import { ConsoleOutput } from "../../console/define/ConsoleOutput.ts";
import { HelpOptions, helpOptionsLayout } from "../../console/embedded/help/HelpCommand.ts";
import { NullArgs, nullArgsLayout } from "../../console/embedded/null/NullArgs.ts";
import { Table } from "../../console/runtime/Table.ts";
import { GlobalService } from "../../flux/context/global.ts";
import { GlobalServiceRegistry } from "../../flux/context/GlobalServiceRegistry.ts";

export class ServicesListCommand extends ConsoleCommand<NullArgs, HelpOptions> {
  public constructor() {
    super({
      args: nullArgsLayout,
      description: "Displays services list.",
      name: "list",
      options: helpOptionsLayout,
    });
  }

  public async execute(
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
    { output }: {
      output: ConsoleOutput;
    },
  ): Promise<number> {
    const headers = {
      key: "KEY",
      depends: "DEPENDS",
    };
    const table = new Table({
      headers,
      orders: ["key", "depends"],
      showHeaders: true,
    });
    const values = [...globalServiceRegistry.services.values()];
    values.sort((a, b) => a.key.toString().localeCompare(b.key.toString()));
    for (const service of values) {
      const { key, globalDeps } = service;
      const row = {
        key: key.toString(),
        depends: globalDeps.map((d) => d.toString()).sort((a, b) => a.localeCompare(b)).join(", "),
      };
      table.addRow(row);
    }

    const buffer = table.getTableAsString();
    output.write(buffer);

    return 0;
  }
}

export const servicesListCommandService: GlobalService = {
  globalDeps: [],
  key: "servicesListCommand",
  provider: async () => new ServicesListCommand(),
};
