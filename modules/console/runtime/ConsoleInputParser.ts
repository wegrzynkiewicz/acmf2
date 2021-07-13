import { debug } from "../../debugger/debug.ts";
import { ArgParsingOptions, parse } from "../../deps.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { AnyConsoleCommand } from "../define/ConsoleCommand.ts";
import { LayoutCommandArgument } from "../layout/layoutArguments.ts";

function getBooleanOptions(command: AnyConsoleCommand): string[] {
  const options: string[] = [];
  const properties = Object.entries(command.optionsLayout.properties);
  for (const [name, option] of properties) {
    if (option.type === "boolean") {
      options.push(name);
    }
  }
  return options;
}

function getStringOptions(command: AnyConsoleCommand): string[] {
  const options: string[] = [];
  const properties = Object.entries(command.optionsLayout.properties);
  for (const [name, option] of properties) {
    if (option.type !== "boolean") {
      options.push(name);
    }
  }
  return options;
}

function getDefaultOptions(
  command: AnyConsoleCommand,
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const properties = Object.entries(command.optionsLayout.properties);
  for (const [name, option] of properties) {
    defaults[name] = option.default;
  }
  return defaults;
}

function getAliasOptions(command: AnyConsoleCommand): Record<string, string> {
  const aliases: Record<string, string> = {};
  const properties = Object.entries(command.optionsLayout.properties);
  for (const [name, option] of properties) {
    const { longFlags, shortFlags } = option;
    for (const longFlag of longFlags) {
      aliases[longFlag] = name;
    }
    for (const shortFlag of shortFlags) {
      aliases[shortFlag] = name;
    }
  }
  return aliases;
}

export interface ParsedInput {
  argsInput: Record<string, unknown>;
  optionsInput: Record<string, unknown>;
}

export type ArgumentType = number | string;

export type OptionsType = {
  [k: string]: any;
};

export interface ParsedFromCLI {
  args: ArgumentType[];
  options: OptionsType;
}

export class ConsoleInputParser {
  public parse(
    { args, command }: {
      args: string[];
      command: AnyConsoleCommand;
    },
  ): ParsedInput {
    const parsed = this.parseFromCLI({
      args,
      command,
    });
    const argsInput = this.extractArguments({
      args: parsed.args,
      command,
    });
    const optionsInput = this.extractOptions({
      options: parsed.options,
      command,
    });

    return {
      argsInput,
      optionsInput,
    };
  }

  public parseFromCLI(
    { args, command }: {
      args: string[];
      command: AnyConsoleCommand;
    },
  ): ParsedFromCLI {
    const options: ArgParsingOptions = {
      "--": true,
      alias: getAliasOptions(command),
      boolean: getBooleanOptions(command),
      default: getDefaultOptions(command),
      stopEarly: true,
      string: getStringOptions(command),
      unknown: (argument) => {
        if (argument.startsWith("-")) {
          throw new Breaker({
            kind: "console-option-unexpected",
            message: `Passed unexpected option named (${argument}).`,
            status: 1,
          });
        }
        return true;
      },
    };
    const parsedArgs = parse(args, options);

    debug({
      channel: "CONSOLE",
      kind: "console-arguments-parsing",
      message: `Parsing command (${command.name}) arguments...`,
      parameters: {
        inputArgs: args,
        parsedArgs,
      },
    });

    const { _: parsedArguments, "--": dashes, ...parsedOptions } = parsedArgs;
    const afterDashes = Array.isArray(dashes) && dashes.length > 0
      ? (["--", ...dashes] as string[])
      : [];
    const allArguments = [...parsedArguments, ...afterDashes];

    return {
      args: allArguments,
      options: parsedOptions,
    };
  }

  public extractArguments(
    { args, command }: {
      args: ArgumentType[];
      command: AnyConsoleCommand;
    },
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const { order, properties, required } = command.argumentsLayout;
    const argsList = [...args];

    for (const name of order) {
      const property = properties[name] as LayoutCommandArgument;
      const isRequired = required.includes(name);

      if (isRequired && argsList.length === 0) {
        throw new Breaker({
          args: { name },
          kind: "console-argument-missing",
          message: `Not passed required argument named (${name}).`,
          status: 1,
        });
      }

      if (property.type === "array") {
        const values = argsList.splice(0);
        result[name] = values.length === 0 ? property.default : values;
        continue;
      }

      const value = argsList.shift();
      if (value === undefined && property.default) {
        result[name] = property.default;
        continue;
      }

      result[name] = value;
    }

    if (argsList.length > 0) {
      const size = Object.keys(properties).length;
      throw new Breaker({
        kind: "console-overflow-arguments",
        message: `Passed more arguments then expected count (${size}).`,
        status: 1,
      });
    }

    return result;
  }

  public extractOptions(
    { command, options }: {
      command: AnyConsoleCommand;
      options: OptionsType;
    },
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const { properties, required } = command.optionsLayout;
    for (const [name, option] of Object.entries(properties)) {
      const value = options[name];
      const isRequired = required.includes(name);

      if (value === undefined) {
        if (isRequired) {
          throw new Breaker({
            args: { name },
            kind: "console-option-missing",
            message: `Not passed required option named (${name}).`,
            status: 1,
          });
        }
        result[name] = option.default;
        continue;
      }

      if (option.type === "boolean" && typeof value !== "boolean") {
        throw new Breaker({
          kind: "console-boolean-invalid",
          message: `Option named (${name}) received value, which not expected.`,
          status: 1,
        });
      }

      result[name] = value;
    }
    return result;
  }
}
