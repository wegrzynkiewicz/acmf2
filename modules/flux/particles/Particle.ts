import { ConfigRegistry } from "../../config/ConfigRegistry.ts";
import { ConsoleCommand } from "../../console/define/ConsoleCommand.ts";
import { Context } from "../../context/Context.ts";
import { ServiceRegistry } from "../../context/ServiceRegistry.ts";
import { ParticleManager } from "./ParticleManager.ts";

export interface Particle {
  bootstrap?: (
    globalContext: {
      globalContext: Context;
      serviceRegistry: ServiceRegistry;
    },
  ) => Promise<void>;

  initParticles?: (
    globalContext: {
      globalContext: Context;
      particleManager: ParticleManager;
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
      commander: ConsoleCommand;
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
