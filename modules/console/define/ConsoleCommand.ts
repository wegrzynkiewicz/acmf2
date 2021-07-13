import { debug } from "../../debugger/debug.ts";
import { ExecutableHandler } from "../../context/Executable.ts";
import { Context } from "../../context/Context.ts";
import {
  LayoutCommandArgument,
  LayoutCommandArguments,
} from "../layout/layoutArguments.ts";
import {
  LayoutCommandOption,
  LayoutCommandOptions,
} from "../layout/layoutOptions.ts";
import { ConsoleArgument } from "./ConsoleArgument.ts";
import { ConsoleOption } from "./ConsoleOption.ts";
import { ConsoleOptionParameter } from "./ConsoleOptionParameter.ts";

export type AnyConsoleCommand = ConsoleCommand<
  any | undefined,
  any | undefined
>;

export class ConsoleCommand<
  ArgumentsType extends object,
  OptionsType extends object,
> implements ExecutableHandler {
  public readonly aliases = new Set<string>();
  public readonly args = new Map<string, ConsoleArgument>();
  public readonly argumentsLayout: LayoutCommandArguments<ArgumentsType>;
  public readonly commands = new Map<string, ConsoleCommand<any, any>>();
  public readonly description: string;
  public readonly hidden: boolean;
  public readonly name: string;
  public readonly options = new Map<string, ConsoleOption>();
  public readonly optionsLayout: LayoutCommandOptions<Required<OptionsType>>;

  public constructor(
    { aliases, argumentsLayout, description, name, hidden, optionsLayout }: {
      aliases?: string[];
      argumentsLayout: LayoutCommandArguments<ArgumentsType>;
      description?: string;
      name: string;
      hidden?: boolean;
      optionsLayout: LayoutCommandOptions<OptionsType>;
    },
  ) {
    this.description = description ?? "";
    this.hidden = hidden ?? false;
    this.name = name;
    this.argumentsLayout = argumentsLayout;
    this.optionsLayout = optionsLayout;

    for (const alias of aliases ?? []) {
      this.aliases.add(alias);
    }

    if (argumentsLayout !== undefined) {
      for (const name of argumentsLayout.order) {
        const layout = argumentsLayout.properties[name];
        const propertyLayout = layout as LayoutCommandArgument;
        const { default: defaults, description, type } = propertyLayout;
        const argument = new ConsoleArgument({
          defaults,
          description,
          name,
          required: argumentsLayout.required.includes(name),
          type,
        });
        this.args.set(name, argument);
      }
    }

    if (optionsLayout !== undefined) {
      const options = Object.entries(optionsLayout.properties);
      for (const [name, layout] of options) {
        const propertyLayout = layout as LayoutCommandOption;
        const {
          description,
          default: defaults,
          longFlags,
          shortFlags,
          type,
        } = propertyLayout;
        let parameter: ConsoleOptionParameter | undefined = undefined;
        if (propertyLayout.type !== "boolean") {
          const { parameterRequired } = propertyLayout;
          parameter = new ConsoleOptionParameter({
            name,
            defaults,
            required: parameterRequired === true,
          });
        }
        const option = new ConsoleOption({
          description,
          longFlags,
          name,
          parameter,
          required: optionsLayout.required.includes(name),
          shortFlags,
          type,
        });
        this.options.set(name, option);
      }
    }
  }

  public registerCommand(command: AnyConsoleCommand): void {
    const { name } = command;
    debug({
      kind: "console-command-registering",
      message:
        `Registering console command (${name}) to parent command (${this.name})`,
    });
    this.commands.set(name, command);
  }

  public getCommandByName(commandName: string): AnyConsoleCommand {
    for (const command of this.commands.values()) {
      if (command.name === commandName) {
        return command;
      }
      if (command.aliases.has(commandName)) {
        return command;
      }
    }
    throw new Error(`Command named (${commandName}) not exists.`);
  }

  public execute(
    _globalContext: Context,
    _localContext?: Context,
    _options?: Context,
  ): Promise<number> {
    throw new Error("Console header must implement execute method.");
  }
}
