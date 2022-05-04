import { GlobalContext } from "../../flux/context/GlobalContext.ts";
import { GlobalService } from "../../flux/context/GlobalService.ts";
import { LogConfig } from "../LogConfig.ts";
import { BasicLogger } from "../loggers/BasicLogger.ts";
import { Logger, LoggerParameters } from "../loggers/Logger.ts";
import { nullLogger } from "../loggers/NullLogger.ts";

export interface LoggerFactory {
  produceLogger(extraParameters: LoggerParameters): Logger;
}

export async function provideLoggerFactory(
  { globalContext, logConfig }: {
    globalContext: GlobalContext;
    logConfig: LogConfig;
  },
): Promise<LoggerFactory> {
  if (logConfig.enabled === false) {
    const produceLogger = () => nullLogger;
    return { produceLogger };
  }
  const produceLogger = (extraParameters: LoggerParameters): Logger => {
    const parameters: LoggerParameters = {
      ...extraParameters,
    };
    const logger = new BasicLogger(
      globalContext,
      { parameters },
    );
    return logger;
  };
  return { produceLogger };
}

export const loggerFactoryService: GlobalService = {
  globalDeps: ["globalContext", "logConfig"],
  key: "loggerFactory",
  provider: provideLoggerFactory,
};
