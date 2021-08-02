import { LayoutConfigExtractor } from "../config/LayoutConfigExtractor.ts";
import { Context } from "../flux/context/Context.ts";
import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { provideLogBus } from "./logBus/provideLogBus.ts";
import { logConfigLayout } from "./LogConfig.ts";
import { provideLoggerFactory } from "./loggerFactory/provideLoggerFactory.ts";

export class LogParticle implements Particle {
  public async initServices(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const [
      globalContext,
      layoutConfigExtractor,
      standardStreams,
    ] = await Promise.all([
      serviceRegistry.fetchByName<Context>("globalContext"),
      serviceRegistry.fetchByCreator(LayoutConfigExtractor),
      serviceRegistry.fetchByName<StandardStreams>("standardStreams"),
    ]);
    const logConfig = await layoutConfigExtractor.extractConfig(
      logConfigLayout,
    );
    const [logBus, loggerFactory] = await Promise.all([
      provideLogBus({ logConfig, standardStreams }),
      provideLoggerFactory({ logConfig, globalContext }),
    ]);
    serviceRegistry.registerServices({ logBus, logConfig, loggerFactory });
  }
}
