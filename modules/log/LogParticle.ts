import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { Context } from "../context/Context.ts";
import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { provideLogBus } from "./logBus/provideLogBus.ts";
import { provideLoggerFactory } from "./loggerFactory/provideLoggerFactory.ts";

export class LogParticle implements Particle {
  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry;
  }

  public async initServices(
    { globalContext, serviceRegistry }: {
      globalContext: Context;
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const logBus = await provideLogBus({ serviceRegistry });
    const loggerFactory = await provideLoggerFactory({
      globalContext,
      serviceRegistry,
    });
    serviceRegistry.registerServices({ logBus, loggerFactory });
  }
}
