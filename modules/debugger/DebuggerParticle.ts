import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";

export class DebuggerParticle implements Particle {
  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry({
      defaults: "0",
      key: "APP_DEBUGGER_ENABLED",
    });
  }
}
