import { ArgParsingOptions, parse } from "../../deps.ts";
import { AnyConsoleCommand } from "../define/ConsoleCommand.ts";

function getBooleanOptions(command: AnyConsoleCommand): string[] {
  const options: string[] = [];
  for (const option of command.options.values()) {
    if (!option.parameter) {
      options.push(option.name);
    }
  }
  return options;
}

function getStringOptions(command: AnyConsoleCommand): string[] {
  const options: string[] = [];
  for (const option of command.options.values()) {
    if (option.parameter) {
      options.push(option.name);
    }
  }
  return options;
}

function getDefaultOptions(
  command: AnyConsoleCommand,
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const option of command.options.values()) {
    const { name, parameter } = option;
    if (parameter) {
      defaults[name] = parameter.defaults;
    }
  }
  return defaults;
}

function getAliasOptions(command: AnyConsoleCommand): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const option of command.options.values()) {
    const { name, longFlags, shortFlags } = option;
    for (const longFlag of longFlags) {
      aliases[longFlag] = name;
    }
    for (const shortFlag of shortFlags) {
      aliases[shortFlag] = name;
    }
  }
  return aliases;
}

export interface ParsedArguments {
  args: Map<string, unknown>;
  options: Map<string, unknown>;
}

export class ConsoleInputParser {
  public parse(
    { args, command }: {
      args: string[];
      command: AnyConsoleCommand;
    },
  ): ParsedArguments {
    const options: ArgParsingOptions = {
      "--": true,
      alias: getAliasOptions(command),
      boolean: getBooleanOptions(command),
      default: getDefaultOptions(command),
      stopEarly: true,
      string: getStringOptions(command),
      unknown: (argument) => {
        if (argument.startsWith("-")) {
          throw new Error(`Unknown option named (${argument}).`);
        }
        return true;
      },
    };
    const parsedArgs = parse(args, options);

    const { _: parsedArguments, "--": dashes, ...parsedOptions } = parsedArgs;
    const afterDashes = Array.isArray(dashes) && dashes.length > 0
      ? (["--", ...dashes] as string[])
      : [];
    const allArguments = [...parsedArguments, ...afterDashes];

    const argumentsMap = new Map<string, unknown>();
    const filteredArguments = allArguments.map((a) => a.toString());
    for (const argument of command.args.values()) {
      const argumentValue = argument.digValueFromArray(filteredArguments);
      argument.assert(argumentValue);
      argumentsMap.set(argument.name, argumentValue);
    }

    if (filteredArguments.length > 0) {
      throw new Error(
        `Passed more arguments then expected count (${command.args.size}).`,
      );
    }

    const optionMap = new Map<string, unknown>();
    for (const option of command.options.values()) {
      const optionValue = parsedOptions[option.name] as unknown;
      option.assert(optionValue);
      optionMap.set(option.name, optionValue);
    }

    return {
      args: argumentsMap,
      options: optionMap,
    };
  }
}
