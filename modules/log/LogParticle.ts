import { ConfigRegistry } from "../config/ConfigRegistry.ts";
import { Context } from "../context/Context.ts";
import { ServiceRegistry } from "../context/ServiceRegistry.ts";
import { Particle } from "../flux/particles/Particle.ts";
import { provideLogBus } from "./logBus/provideLogBus.ts";
import { provideLoggerFactory } from "./loggerFactory/provideLoggerFactory.ts";

function initConfigForStream(
  { configRegistry, name, key }: {
    configRegistry: ConfigRegistry;
    name: string;
    key: string;
  },
): void {
  configRegistry.registerEntry({
    comment: `Enabling the logging to standard ${name} stream.`,
    defaults: "1",
    key: `APP_LOG_${key}_ENABLED`,
  });
  configRegistry.registerEntry({
    comment: `Minimum severity level for standard ${name} stream.`,
    defaults: "1",
    key: `APP_LOG_${key}_MIN_SEVERITY`,
  });
}

export class LogParticle implements Particle {
  public async initConfig(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ): Promise<void> {
    configRegistry.registerEntry({
      comment: "Enabling the logging mechanism.",
      defaults: "1",
      key: "APP_LOG_ENABLED",
    });

    initConfigForStream({ configRegistry, key: "STDOUT", name: "output" });
    initConfigForStream({ configRegistry, key: "STDERR", name: "error" });

    configRegistry.registerEntry({
      comment: "Add additional tags to all loggers.",
      defaults: "{}",
      key: "APP_LOG_TAGS",
    });
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
    const logger = loggerFactory.produceLogger({ channel: "ROOT" });

    serviceRegistry.registerServices({ logBus, logger, loggerFactory });
  }
}
