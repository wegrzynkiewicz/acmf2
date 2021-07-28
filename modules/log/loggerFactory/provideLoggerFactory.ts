import { Context } from "../../context/Context.ts";
import { LogConfig } from "../LogConfig.ts";
import { BasicLogger } from "../loggers/BasicLogger.ts";
import { NullLogger } from "../loggers/NullLogger.ts";
import { LoggerConstructor, LoggerFactory } from "./LoggerFactory.ts";

export async function provideLoggerFactory(
  { globalContext, logConfig }: {
    globalContext: Context;
    logConfig: LogConfig;
  },
): Promise<LoggerFactory> {
  const loggerConstructor = (
    logConfig.enabled ? BasicLogger : NullLogger
  ) as LoggerConstructor;
  const loggerFactory = new LoggerFactory(
    { globalContext },
    { loggerConstructor, parameters: {} },
  );

  return loggerFactory;
}
