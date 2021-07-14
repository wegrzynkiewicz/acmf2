import { Config } from "../../config/Config.ts";
import { Context } from "../../context/Context.ts";
import { ServiceRegistry } from "../../context/ServiceRegistry.ts";
import { BasicLogger } from "../loggers/BasicLogger.ts";
import { NullLogger } from "../loggers/NullLogger.ts";
import { LoggerConstructor, LoggerFactory } from "./LoggerFactory.ts";

export async function provideLoggerFactory(
  { globalContext, serviceRegistry }: {
    globalContext: Context;
    serviceRegistry: ServiceRegistry;
  },
): Promise<LoggerFactory> {
  const config = await serviceRegistry.fetchByCreator(Config);
  const enabled = config.get("APP_LOG_ENABLED");
  const loggerConstructor = (
    enabled ? BasicLogger : NullLogger
  ) as LoggerConstructor;
  const loggerFactory = new LoggerFactory(
    { globalContext },
    { loggerConstructor, parameters: {} },
  );

  return loggerFactory;
}
