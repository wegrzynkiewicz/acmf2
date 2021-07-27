import { debug } from "../../debugger/debug.ts";
import { ExecutableHandler } from "../../context/Executable.ts";
import { Context } from "../../context/Context.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { LayoutObject } from "../../layout/layout.ts";

export type AnyConsoleCommand = ConsoleCommand<object, object>;

export class ConsoleCommand<
  ArgumentsType extends object,
  OptionsType extends object,
> implements ExecutableHandler {
  public readonly aliases = new Set<string>();
  public readonly argumentsLayout: LayoutObject<ArgumentsType>;
  public readonly commands = new Map<string, ConsoleCommand<object, object>>();
  public readonly description: string;
  public readonly hidden: boolean;
  public readonly name: string;
  public readonly optionsLayout: LayoutObject<Required<OptionsType>>;

  public constructor(
    { aliases, argumentsLayout, description, name, hidden, optionsLayout }: {
      aliases?: string[];
      argumentsLayout: LayoutObject<ArgumentsType>;
      description?: string;
      name: string;
      hidden?: boolean;
      optionsLayout: LayoutObject<OptionsType>;
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
  }

  public registerCommand(command: AnyConsoleCommand): void {
    const { name } = command;
    debug({
      channel: "CONSOLE",
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
    throw new Breaker({
      kind: "console-command-missing",
      message:
        `Command named (${commandName}) not exists in parent command (${this.name}).`,
      status: 1,
    });
  }

  public execute(
    _globalContext: Context,
    _localContext?: Context,
    _options?: Context,
  ): Promise<number> {
    throw new Error("Console header must implement execute method.");
  }
}
