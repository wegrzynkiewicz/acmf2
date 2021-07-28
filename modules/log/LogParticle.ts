import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { Context } from "../context/Context.ts";
import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { provideLogBus } from "./logBus/provideLogBus.ts";
import { LogConfig, logConfigLayout } from "./LogConfig.ts";
import { provideLoggerFactory } from "./loggerFactory/provideLoggerFactory.ts";

export class LogParticle implements Particle {
  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntriesFromLayout(logConfigLayout);
  }

  public async initServices(
    { globalContext, serviceRegistry }: {
      globalContext: Context;
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const [logConfig, standardStreams] = await Promise.all([
      serviceRegistry.fetchByName<LogConfig>("logConfig"),
      serviceRegistry.fetchByName<StandardStreams>("standardStreams"),
    ]);
    const [logBus, loggerFactory] = await Promise.all([
      provideLogBus({ logConfig, standardStreams }),
      provideLoggerFactory({ logConfig, globalContext }),
    ]);
    serviceRegistry.registerServices({ logBus, loggerFactory });
  }
}
