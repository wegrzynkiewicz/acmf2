import { debug } from "../../debugger/debug.ts";
import { ExecutableHandler } from "../../flux/context/Executable.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { Context, GlobalContext } from "../../flux/context/Context.ts";
import { LayoutConsoleArguments } from "./ConsoleArgument.ts";
import { LayoutConsoleOptions } from "./ConsoleOption.ts";

export type UnknownConsoleCommand = ConsoleCommand<unknown, unknown>;

export class ConsoleCommand<TArgs, TOptions> implements ExecutableHandler {
  public readonly aliases = new Set<string>();
  public readonly args: LayoutConsoleArguments<TArgs>;
  public readonly commands = new Map<string, UnknownConsoleCommand>();
  public readonly description: string;
  public readonly hidden: boolean;
  public readonly name: string;
  public readonly options: LayoutConsoleOptions<TOptions>;

  public constructor(
    { aliases, args, description, name, hidden, options }: {
      aliases?: string[];
      args: LayoutConsoleArguments<TArgs>;
      description?: string;
      name: string;
      hidden?: boolean;
      options: LayoutConsoleOptions<TOptions>;
    },
  ) {
    this.description = description ?? "";
    this.hidden = hidden ?? false;
    this.name = name;
    this.args = args;
    this.options = options;

    for (const alias of aliases ?? []) {
      this.aliases.add(alias);
    }
  }

  public registerCommand(command: UnknownConsoleCommand): void {
    const { name } = command;
    debug({
      channel: "CONSOLE",
      kind: "console-command-registering",
      message:
        `Registering console command (${name}) to parent command (${this.name})`,
    });
    this.commands.set(name, command);
  }

  public getCommandByName(commandName: string): UnknownConsoleCommand {
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
    _globalContext: GlobalContext,
    _localContext?: Context,
    _options?: Context,
  ): Promise<number> {
    throw new Error("Console header must implement execute method.");
  }
}
