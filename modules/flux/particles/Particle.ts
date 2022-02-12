import { ConfigRegistry } from "../../config/ConfigRegistry.ts";
import { GlobalContext } from "../context/Context.ts";
import { GlobalServiceRegistry } from "../context/GlobalServiceRegistry.ts";
import { ParticleRegistry } from "./ParticleRegistry.ts";

export interface Particle {
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
}
