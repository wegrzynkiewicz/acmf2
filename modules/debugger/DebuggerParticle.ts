import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { debugConfigLayout } from "./DebugConfig.ts";

export class DebuggerParticle implements Particle {
  public async bootstrap(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    const debugConfig = debugConfigLayout;
    configRegistry.registerConfigFromLayouts({debugConfig});
  }
}
