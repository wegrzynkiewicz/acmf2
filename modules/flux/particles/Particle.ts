import { ConfigRegistry } from "../../config/ConfigRegistry.ts";
import {
  AnyConsoleCommand,
  ConsoleCommand,
} from "../../console/define/ConsoleCommand.ts";
import { Context } from "../../context/Context.ts";
import { ServiceRegistry } from "../../context/ServiceRegistry.ts";

export interface Particle {
  bootstrap?: (
    globalContext: {
      globalContext: Context;
      serviceRegistry: ServiceRegistry;
    },
  ) => Promise<void>;

  initServices?: (
    globalContext: {
      globalContext: Context;
      serviceRegistry: ServiceRegistry;
    },
  ) => Promise<void>;

  initCommands?: (
    globalContext: {
      commander: AnyConsoleCommand;
    },
  ) => Promise<void>;

  initConfig?: (
    globalContext: {
      configRegistry: ConfigRegistry;
    },
  ) => Promise<void>;

  execute?: (
    globalContext: any,
  ) => Promise<void>;
}
