import type { ConsoleArgument } from "../define/ConsoleArgument.ts";
import type { AnyConsoleCommand } from "../define/ConsoleCommand.ts";
import type { ConsoleOption } from "../define/ConsoleOption.ts";
import type { ConsoleOptionParameter } from "../define/ConsoleOptionParameter.ts";
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

  public writeHelp(command: AnyConsoleCommand): void {
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

  public writeCommandUsage(command: AnyConsoleCommand): void {
    const { args, hidden, name, options } = command;
    this.output.write("Usage:");
    this.output.write(` ${this.executableName}`);
    if (name !== "" && !hidden) {
      this.output.write(` ${name}`);
    }
    if (options.size > 0) {
      this.output.write(" [options]");
    }
    if (args.size > 0) {
      for (const argument of args.values()) {
        const commandArgumentLabel = this.getCommandArgumentLabel(argument);
        this.output.write(` ${commandArgumentLabel}`);
      }
    }
    this.output.writeLine("");
    this.output.writeLine("");
  }

  public writeCommandDescription(command: AnyConsoleCommand): void {
    const { description } = command;
    if (description) {
      this.output.writeLine(description);
      this.output.writeLine("");
    }
  }

  public writeCommandAliases(command: AnyConsoleCommand): void {
    const { aliases } = command;
    if (aliases.size > 0) {
      this.output.writeLine("Aliases:");
      const aliasLine = [...aliases.values()].join(", ");
      this.output.writeLine(`  ${aliasLine}`);
      this.output.writeLine("");
    }
  }

  public getCommandArgumentLabel(argument: ConsoleArgument): string {
    const { defaults, name, rest, required } = argument;
    let label = name;
    if (rest) {
      label += "...";
    }
    if (typeof defaults === "string" && !rest) {
      label += `="${defaults.toString()}"`;
    }
    label = required ? `<${label}>` : `[${label}]`;
    return label;
  }

  public getCommandArguments(command: AnyConsoleCommand): UsageInfo[] {
    const table: UsageInfo[] = [];
    for (const argument of command.args.values()) {
      const argumentData: UsageInfo = {
        header: `  ${this.getCommandArgumentLabel(argument)}`,
        description: argument.description,
      };
      table.push(argumentData);
    }
    return table;
  }

  public getCommandOptions(command: AnyConsoleCommand): UsageInfo[] {
    const table: UsageInfo[] = [];
    for (const option of command.options.values()) {
      const optionRow: UsageInfo = {
        header: `  ${this.getCommandOptionLabel(option)}`,
        description: option.description,
      };
      table.push(optionRow);
    }
    return table;
  }

  public getCommandOptionLabel(option: ConsoleOption): string {
    const { longFlags, parameter, shortFlags } = option;
    const flags: string[] = [];
    if (shortFlags.length > 0) {
      for (const shortFlag of shortFlags) {
        flags.push(`-${shortFlag}`);
      }
    }
    if (longFlags.length > 0) {
      for (const longFlag of longFlags) {
        flags.push(`--${longFlag}`);
      }
    }
    let label = flags.join(", ");
    if (parameter) {
      label += "=";
      label += this.getCommandOptionParameterLabel(parameter);
    }
    return label;
  }

  public getCommandOptionParameterLabel(
    parameter: ConsoleOptionParameter,
  ): string {
    const { defaults, name, required } = parameter;
    let label = name;
    if (typeof defaults === "string") {
      label += `="${defaults}"`;
    }
    label = required ? `<${label}>` : `[${label}]`;
    return label;
  }

  public getSubCommands(command: AnyConsoleCommand): UsageInfo[] {
    const list: UsageInfo[] = [];
    for (const child of command.commands.values()) {
      if (!child.hidden) {
        list.push(this.getAvailableCommandDescription(child));
      }
    }
    return list;
  }

  public getAvailableCommandDescription(command: AnyConsoleCommand): UsageInfo {
    const { name, description } = command;
    let header = `  ${name}`;
    const usageTable: UsageInfo = {
      description,
      header,
    };
    return usageTable;
  }
}
