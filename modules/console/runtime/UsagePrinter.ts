import { isPrimitiveLayout } from "../../layout/helpers/isPrimitiveLayout.ts";
import { Layout } from "../../layout/layout.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";
import { LayoutUnknownConsoleOption } from "../define/option.ts";
import { ConsoleOutput } from "../define/ConsoleOutput.ts";

export interface UsageInfo {
  description: string;
  header: string;
}

export interface UsagePrinter {
  printHelp(): void;
}

export function writeHelp(
  { childrenCommands, command, output }: {
    childrenCommands: UnknownConsoleCommand[];
    command: UnknownConsoleCommand;
    output: ConsoleOutput;
  },
): void {
  writeCommandUsage({command, output});
  if (command.description) {
    output.writeLine(command.description);
    output.writeLine("");
  }
  const argumentInfo = getCommandArguments(command);
  const optionsInfo = getCommandOptions(command);
  const commandsInfo = getSubCommands(childrenCommands);
  let maxLength = 0;
  for (const infos of [argumentInfo, optionsInfo, commandsInfo]) {
    for (const { header } of infos) {
      if (header.length > maxLength) {
        maxLength = header.length;
      }
    }
  }
  writeInfo({ info: argumentInfo, maxLength, output, title: "Arguments:" });
  writeInfo({ info: optionsInfo, maxLength, output, title: "Options:" });
  writeInfo({ info: commandsInfo, maxLength, output, title: "Commands:" });
}

export function writeInfo(
  { info, maxLength, output, title }: {
    info: UsageInfo[];
    maxLength: number;
    output: ConsoleOutput;
    title: string;
  },
): void {
  if (info.length > 0) {
    output.writeLine(title);
    for (const { description, header } of info) {
      output.write(header.padEnd(maxLength + 3, " "));
      output.writeLine(description);
    }
    output.writeLine("");
  }
}

export function writeCommandUsage(
  { command, output }: {
    command: UnknownConsoleCommand;
    output: ConsoleOutput;
  },
): void {
  const { args, key, options } = command;
  output.write("Usage:");
  output.write(` ${key.split(":").join(" ")}`);
  if (Object.keys(options.properties).length > 0) {
    output.write(" [options]");
  }
  const argsEntries = Object.entries(args.properties);
  if (argsEntries.length > 0) {
    const requiredProperties = args.required ?? {};
    for (const [name, layout] of argsEntries) {
      const required = requiredProperties[name] ?? true;
      const commandArgumentLabel = getCommandArgumentLabel({
        name,
        layout,
        required,
      });
      output.write(` ${commandArgumentLabel}`);
    }
  }
  output.writeLine("");
  output.writeLine("");
}

export function getCommandArgumentLabel(
  { name, layout, required }: {
    name: string;
    layout: Layout;
    required: boolean;
  },
): string {
  const rest = layout.type === "array";
  const defaults = isPrimitiveLayout(layout) ? layout.defaults : undefined;
  let label = layout.title ?? name;
  if (rest) {
    label += "...";
  }
  if (defaults !== undefined && !rest) {
    label += `="${defaults.toString()}"`;
  }
  label = required ? `<${label}>` : `[${label}]`;
  return label;
}

export function getCommandArguments(command: UnknownConsoleCommand): UsageInfo[] {
  const table: UsageInfo[] = [];
  const properties = Object.entries(command.args.properties);
  const requiredProperties = command.args.required ?? {};
  for (const [name, layout] of properties) {
    const required = requiredProperties[name] ?? true;
    const label = getCommandArgumentLabel({ layout, name, required });
    const argumentData: UsageInfo = {
      header: `  ${label}`,
      description: layout.description ?? "",
    };
    table.push(argumentData);
  }
  return table;
}

export function getCommandOptions(command: UnknownConsoleCommand): UsageInfo[] {
  const table: UsageInfo[] = [];
  const properties = Object.entries(command.options.properties);
  const requiredProperties = command.options.required ?? {};
  for (const [name, layout] of properties) {
    const required = requiredProperties[name] ?? true;
    const label = getCommandOptionLabel({ name, layout, required });
    const optionRow: UsageInfo = {
      header: `  ${label}`,
      description: layout.description ?? "",
    };
    table.push(optionRow);
  }
  return table;
}

export function getCommandOptionLabel(
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
    label += getCommandOptionParameterLabel({ name, layout, required });
  }
  return label;
}

export function getCommandOptionParameterLabel(
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

export function getSubCommands(childrenCommands: UnknownConsoleCommand[]): UsageInfo[] {
  const list: UsageInfo[] = [];
  for (const child of childrenCommands) {
    if (!child.hidden) {
      list.push(getAvailableCommandDescription(child));
    }
  }
  list.sort((a, b) => a.header.localeCompare(b.header));
  return list;
}

export function getAvailableCommandDescription(
  command: UnknownConsoleCommand,
): UsageInfo {
  const { key, description } = command;
  const name = key.substring(key.lastIndexOf(":") + 1);
  const header = `  ${name}`;
  const usageTable: UsageInfo = {
    description: description ?? "",
    header,
  };
  return usageTable;
}
