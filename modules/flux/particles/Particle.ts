import { ConfigRegistry } from "../../config/ConfigRegistry.ts";
import { ConsoleCommand } from "../../console/define/ConsoleCommand.ts";
import { GlobalContext, GlobalService } from "../context/global.ts";
import { GlobalServiceRegistry } from "../context/GlobalServiceRegistry.ts";
import { EnvironmentVariable } from "../env/EnvironmentVariable.ts";
import { ParticleRegistry } from "./ParticleRegistry.ts";

export interface Particle {
  consoleCommands?: ConsoleCommand<unknown, unknown>[];
  environmentVariables?: EnvironmentVariable[],
  globalServices?: GlobalService[];
  key: string;
}

export interface Particle {
  assignConsoleCommands?: (
    globalContext: GlobalContext,
  ) => Promise<void>;
  initConfigVariables?: (
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ) => Promise<void>;
  initGlobalServices?: (
    { globalServiceRegistry }: {
      globalServiceRegistry: GlobalServiceRegistry;
    },
  ) => Promise<void>;
  initParticles?: (
    { particleRegistry }: {
      particleRegistry: ParticleRegistry;
    },
  ) => Promise<void>;
  execute?: (globalContext: GlobalContext) => Promise<void>;
  name?: string;
}
