import { debug } from "../../debugger/debug.ts";
import { ExecutableHandler } from "../../context/Executable.ts";
import { ConsoleArgument } from "./ConsoleArgument.ts";
import { ConsoleOption } from "./ConsoleOption.ts";
import { Context } from "../../context/Context.ts";

export class ConsoleCommand implements ExecutableHandler {
  public readonly aliases = new Set<string>();
  public readonly args = new Map<string, ConsoleArgument>();
  public readonly commands = new Map<string, ConsoleCommand>();
  public readonly description: string;
  public readonly hidden: boolean;
  public readonly name: string;
  public readonly options = new Map<string, ConsoleOption>();

  public constructor(
    { aliases, args, commands, description, name, hidden, options }: {
      aliases?: string[];
      args?: ConsoleArgument[];
      commands?: ConsoleCommand[];
      description?: string;
      name: string;
      hidden?: boolean;
      options?: ConsoleOption[];
    },
  ) {
    this.description = description ?? "";
    this.hidden = hidden ?? false;
    this.name = name;

    for (const alias of aliases ?? []) {
      this.aliases.add(alias);
    }

    for (const argument of args ?? []) {
      this.args.set(argument.name, argument);
    }

    for (const command of commands ?? []) {
      this.registerCommand(command);
    }

    for (const option of options ?? []) {
      this.options.set(option.name, option);
    }
  }

  public registerCommand(command: ConsoleCommand): void {
    const { name } = command;
    debug({
      kind: "console-command-registering",
      message:
        `Registering console command (${name}) to parent command (${this.name})`,
    });
    this.commands.set(name, command);
  }

  public getCommandByName(commandName: string): ConsoleCommand {
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
