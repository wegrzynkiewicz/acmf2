import { debug } from "../../debugger/debug.ts";
import { Breaker } from "../../flux/Breaker.ts";
import { GlobalContext } from "../../flux/context/global.ts";
import { ScopedContext } from "../../flux/context/scoped.ts";
import { LayoutConsoleArguments } from "./ConsoleArgument.ts";
import { LayoutConsoleOptions } from "./ConsoleOption.ts";

export type UnknownConsoleCommand = ConsoleCommand<unknown, unknown>;

export interface ConsoleCommand<TArgs, TOptions> {
  aliases?: string[];
  args: LayoutConsoleArguments<TArgs>;
  description?: string;
  execute: (
    globalContext: GlobalContext,
    localContext: ScopedContext,
  ) => Promise<number>;
  namespaces: string[];
  hidden?: boolean;
  options: LayoutConsoleOptions<TOptions>;
}

// export class ConsoleCommandX<TArgs, TOptions> {
//   public readonly aliases = new Set<string>();
//   public readonly args: LayoutConsoleArguments<TArgs>;
//   public readonly commands = new Map<string, UnknownConsoleCommand>();
//   public readonly description: string;
//   public readonly hidden: boolean;
//   public readonly name: string;
//   public readonly options: LayoutConsoleOptions<TOptions>;

//   public constructor(
//     { aliases, args, description, name, hidden, options }: {
//       aliases?: string[];
//       args: LayoutConsoleArguments<TArgs>;
//       description?: string;
//       name: string;
//       hidden?: boolean;
//       options: LayoutConsoleOptions<TOptions>;
//     },
//   ) {
//     this.description = description ?? "";
//     this.hidden = hidden ?? false;
//     this.name = name;
//     this.args = args;
//     this.options = options;

//     for (const alias of aliases ?? []) {
//       this.aliases.add(alias);
//     }
//   }

//   public assignCommand(command: UnknownConsoleCommand): void {
//     const { name } = command;
//     debug({
//       channel: "CONSOLE",
//       kind: "console-command-assigning",
//       message: `Assigning console command (${name}) to parent command (${this.name}).`,
//     });
//     this.commands.set(name, command);
//   }

//   public getCommandByName(commandName: string): UnknownConsoleCommand {
//     for (const command of this.commands.values()) {
//       if (command.name === commandName) {
//         return command;
//       }
//       if (command.aliases.has(commandName)) {
//         return command;
//       }
//     }
//     throw new Breaker({
//       kind: "console-command-missing",
//       message: `Command named (${commandName}) not exists in parent command (${this.name}).`,
//       status: 1,
//     });
//   }

//   public execute(
//     _globalContext: GlobalContext,
//     _localContext?: ScopedContext,
//     _options?: unknown,
//   ): Promise<number> {
//     throw new Error("Console command must implement execute method.");
//   }
// }
