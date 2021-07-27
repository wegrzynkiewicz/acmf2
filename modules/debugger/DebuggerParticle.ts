import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";

export class DebuggerParticle implements Particle {
  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry({
      comment: "Enabling the built-in debugger logger.",
      defaults: "0",
      key: "APP_DEBUGGER_ENABLED",
      layout: {
        type: "enumerable",
        values: ["0", "1"],
      },
    });
  }
}
