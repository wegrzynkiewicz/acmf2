import { debug } from "../../debugger/debug.ts";
import { ArgParsingOptions, parse } from "../../deps.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { GlobalService } from "../../flux/context/global.ts";
import { isPrimitiveLayout } from "../../layout/helpers/isPrimitiveLayout.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";

function getBooleanOptions(command: UnknownConsoleCommand): string[] {
  const options: string[] = [];
  const properties = Object.entries(command.options.properties);
  for (const [name, option] of properties) {
    if (option.type === "boolean") {
      options.push(name);
    }
  }
  return options;
}

function getStringOptions(command: UnknownConsoleCommand): string[] {
  const options: string[] = [];
  const properties = Object.entries(command.options.properties);
  for (const [name, option] of properties) {
    if (option.type !== "boolean") {
      options.push(name);
    }
  }
  return options;
}

function getDefaultOptions(
  command: UnknownConsoleCommand,
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const properties = Object.entries(command.options.properties);
  for (const [name, option] of properties) {
    if (isPrimitiveLayout(option)) {
      defaults[name] = option.defaults;
    }
  }
  return defaults;
}

function getAliasOptions(
  command: UnknownConsoleCommand,
): Record<string, string> {
  const aliases: Record<string, string> = {};
  const properties = Object.entries(command.options.properties);
  for (const [name, option] of properties) {
    const { longFlags, shortFlags } = option;
    for (const longFlag of longFlags ?? []) {
      aliases[longFlag] = name;
    }
    for (const shortFlag of shortFlags ?? []) {
      aliases[shortFlag] = name;
    }
  }
  return aliases;
}

export interface ParsedInput {
  args: Record<string, unknown>;
  options: Record<string, unknown>;
}

export type ArgumentType = number | string;

export type OptionsType = {
  [k: string]: unknown;
};

export interface ParsedFromCLI {
  args: ArgumentType[];
  options: OptionsType;
}

export class ConsoleInputParser {
  public parse(
    { args, command }: {
      args: string[];
      command: UnknownConsoleCommand;
    },
  ): ParsedInput {
    const parsed = this.parseFromCLI({
      args,
      command,
    });
    return {
      args: this.extractArguments({
        args: parsed.args,
        command,
      }),
      options: this.extractOptions({
        options: parsed.options,
        command,
      }),
    };
  }

  public parseFromCLI(
    { args, command }: {
      args: string[];
      command: UnknownConsoleCommand;
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
      message: `Parsing command (${command.key}) arguments...`,
      parameters: {
        inputArgs: args,
        parsedArgs,
      },
    });

    const { _: parsedArguments, "--": dashes, ...parsedOptions } = parsedArgs;
    const afterDashes = Array.isArray(dashes) && dashes.length > 0 ? (["--", ...dashes] as string[]) : [];
    const allArguments = [...parsedArguments, ...afterDashes];

    return {
      args: allArguments,
      options: parsedOptions,
    };
  }

  public extractArguments(
    { args, command }: {
      args: ArgumentType[];
      command: UnknownConsoleCommand;
    },
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const { properties, required } = command.args;
    const requiredProperties = required ?? {};
    const argsList = [...args];

    for (const [name, propertyLayout] of Object.entries(properties)) {
      const isRequired = requiredProperties[name] ?? true;

      if (isRequired && argsList.length === 0) {
        throw new Breaker({
          args: { name },
          kind: "console-argument-missing",
          message: `Not passed required argument named (${name}).`,
          status: 1,
        });
      }

      if (propertyLayout.type === "array") {
        const values = argsList.splice(0);
        result[name] = values.length === 0 ? [] : values;
        continue;
      }

      const value = argsList.shift();
      if (
        value === undefined &&
        isPrimitiveLayout(propertyLayout) &&
        propertyLayout.defaults !== undefined
      ) {
        result[name] = propertyLayout.defaults;
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
      command: UnknownConsoleCommand;
      options: OptionsType;
    },
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const { properties, required } = command.options;
    const requiredProperties = required ?? {};
    for (const [name, propertyLayout] of Object.entries(properties)) {
      const value = options[name];

      if (!isPrimitiveLayout(propertyLayout)) {
        throw new Breaker({
          kind: "console-unexpected-option-type",
          message: `Option named (${name}) received value, which not expected.`,
          status: 1,
        });
      }

      if (value === undefined) {
        if (requiredProperties[name]) {
          throw new Breaker({
            args: { name },
            kind: "console-option-missing",
            message: `Not passed required option named (${name}).`,
            status: 1,
          });
        }
        result[name] = propertyLayout.defaults;
        continue;
      }

      if (propertyLayout.type === "boolean" && typeof value !== "boolean") {
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

export const consoleInputParserService: GlobalService = {
  globalDeps: [],
  key: "consoleInputParser",
  provider: async () => new ConsoleInputParser(),
};
