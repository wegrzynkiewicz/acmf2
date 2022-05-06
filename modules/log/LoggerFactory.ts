import { GlobalContext, GlobalService } from "../flux/context/global.ts";
import { BasicLogger } from "./BasicLogger.ts";
import { Logger, LoggerParameters } from "./Logger.ts";
import { enabledSymbol } from "./logVars.ts";
import { nullLogger } from "./NullLogger.ts";

export interface LoggerFactory {
  produceLogger(extraParameters: LoggerParameters): Logger;
}

export async function provideLoggerFactory(
  {
    globalContext,
    [enabledSymbol]: enabled,
  }: {
    globalContext: GlobalContext;
    [enabledSymbol]: boolean;
  },
): Promise<LoggerFactory> {
  if (enabled === false) {
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
