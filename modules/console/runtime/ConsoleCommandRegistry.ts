import { Registry } from "../../common/Registry.ts";
import { GlobalService } from "../../flux/context/global.ts";
import { UnknownConsoleCommand } from "../define/ConsoleCommand.ts";

export type ConsoleCommandRegistry = Registry<UnknownConsoleCommand>;

export const consoleCommandRegistryService: GlobalService<ConsoleCommandRegistry> = {
  globalDeps: [],
  key: "consoleCommandRegistry",
  provider: async () => new Registry<UnknownConsoleCommand>(),
};
