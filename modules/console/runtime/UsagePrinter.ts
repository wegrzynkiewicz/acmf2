import { isPrimitiveLayout } from "../../layout/helpers/isPrimitiveLayout.ts";
import { Layout } from "../../layout/layout.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";
import { LayoutUnknownConsoleOption } from "../define/ConsoleOption.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";

export interface UsageInfo {
  description: string;
  header: string;
}

export class UsagePrinter {
  public readonly executableName: string;
  private readonly output: ConsoleOutput;

  public constructor(
    { executableName, output }: {
      executableName: string;
      output: ConsoleOutput;
    },
  ) {
    this.executableName = executableName;
    this.output = output;
  }

  public writeHelp(command: UnknownConsoleCommand): void {
    this.writeCommandUsage(command);
    this.writeCommandDescription(command);
    this.writeCommandAliases(command);
    const argumentInfo = this.getCommandArguments(command);
    const optionsInfo = this.getCommandOptions(command);
    const commandsInfo = this.getSubCommands(command);
    let maxLength = 0;
    for (const infos of [argumentInfo, optionsInfo, commandsInfo]) {
      for (const { header } of infos) {
        if (header.length > maxLength) {
          maxLength = header.length;
        }
      }
    }
    this.writeInfo({ info: argumentInfo, title: "Arguments:", maxLength });
    this.writeInfo({ info: optionsInfo, title: "Options:", maxLength });
    this.writeInfo({ info: commandsInfo, title: "Commands:", maxLength });
  }

  public writeInfo(
    { info, maxLength, title }: {
      info: UsageInfo[];
      maxLength: number;
      title: string;
    },
  ): void {
    if (info.length > 0) {
      this.output.writeLine(title);
      for (const { description, header } of info) {
        this.output.write(header.padEnd(maxLength + 3, " "));
        this.output.writeLine(description);
      }
      this.output.writeLine("");
    }
  }

  public writeCommandUsage(command: UnknownConsoleCommand): void {
    const { args, hidden, name, options } = command;
    this.output.write("Usage:");
    this.output.write(` ${this.executableName}`);
    if (name !== "" && !hidden) {
      this.output.write(` ${name}`);
    }
    if (Object.keys(options.properties).length > 0) {
      this.output.write(" [options]");
    }
    const argsEntries = Object.entries(args.properties);
    if (argsEntries.length > 0) {
      const requiredProperties = args.required ?? {};
      for (const [name, layout] of argsEntries) {
        const required = requiredProperties[name] ?? true;
        const commandArgumentLabel = this.getCommandArgumentLabel({
          name,
          layout,
          required,
        });
        this.output.write(` ${commandArgumentLabel}`);
      }
    }
    this.output.writeLine("");
    this.output.writeLine("");
  }

  public writeCommandDescription(command: UnknownConsoleCommand): void {
    const { description } = command;
    if (description) {
      this.output.writeLine(description);
      this.output.writeLine("");
    }
  }

  public writeCommandAliases(command: UnknownConsoleCommand): void {
    const { aliases } = command;
    if (aliases.size > 0) {
      this.output.writeLine("Aliases:");
      const aliasLine = [...aliases.values()].join(", ");
      this.output.writeLine(`  ${aliasLine}`);
      this.output.writeLine("");
    }
  }

  public getCommandArgumentLabel(
    { name, layout, required }: {
      name: string;
      layout: Layout;
      required: boolean;
    },
  ): string {
    const rest = layout.type === "array";
    const defaults = isPrimitiveLayout(layout) ? layout.defaults : undefined;
    let label = name;
    if (rest) {
      label += "...";
    }
    if (defaults !== undefined && !rest) {
      label += `="${defaults.toString()}"`;
    }
    label = required ? `<${label}>` : `[${label}]`;
    return label;
  }

  public getCommandArguments(command: UnknownConsoleCommand): UsageInfo[] {
    const table: UsageInfo[] = [];
    const properties = Object.entries(command.args.properties);
    const requiredProperties = command.args.required ?? {};
    for (const [name, layout] of properties) {
      const required = requiredProperties[name] ?? true;
      const label = this.getCommandArgumentLabel({ layout, name, required });
      const argumentData: UsageInfo = {
        header: `  ${label}`,
        description: layout.description ?? "",
      };
      table.push(argumentData);
    }
    return table;
  }

  public getCommandOptions(command: UnknownConsoleCommand): UsageInfo[] {
    const table: UsageInfo[] = [];
    const properties = Object.entries(command.options.properties);
    const requiredProperties = command.options.required ?? {};
    for (const [name, layout] of properties) {
      const required = requiredProperties[name] ?? true;
      const label = this.getCommandOptionLabel({ name, layout, required });
      const optionRow: UsageInfo = {
        header: `  ${label}`,
        description: layout.description ?? "",
      };
      table.push(optionRow);
    }
    return table;
  }

  public getCommandOptionLabel(
    { name, layout, required }: {
      name: string;
      layout: LayoutUnknownConsoleOption;
      required: boolean;
    },
  ): string {
    const { longFlags, shortFlags } = layout ?? {};
    const flags: string[] = [];
    if (Array.isArray(shortFlags) && shortFlags.length > 0) {
      for (const shortFlag of shortFlags) {
        flags.push(`-${shortFlag}`);
      }
    }
    if (Array.isArray(longFlags) && longFlags.length > 0) {
      for (const longFlag of longFlags) {
        flags.push(`--${longFlag}`);
      }
    }
    let label = flags.join(", ");
    if (layout.type !== "boolean") {
      label += "=";
      label += this.getCommandOptionParameterLabel({ name, layout, required });
    }
    return label;
  }

  public getCommandOptionParameterLabel(
    { name, layout, required }: {
      name: string;
      layout: Layout;
      required: boolean;
    },
  ): string {
    const defaults = isPrimitiveLayout(layout) ? layout.defaults : undefined;
    let label = name;
    if (typeof defaults === "string") {
      label += `="${defaults}"`;
    }
    label = required ? `<${label}>` : `[${label}]`;
    return label;
  }

  public getSubCommands(command: UnknownConsoleCommand): UsageInfo[] {
    const list: UsageInfo[] = [];
    for (const child of command.commands.values()) {
      if (!child.hidden) {
        list.push(this.getAvailableCommandDescription(child));
      }
    }
    list.sort((a, b) => a.header.localeCompare(b.header));
    return list;
  }

  public getAvailableCommandDescription(
    command: UnknownConsoleCommand,
  ): UsageInfo {
    const { name, description } = command;
    let header = `  ${name}`;
    const usageTable: UsageInfo = {
      description,
      header,
    };
    return usageTable;
  }
}
