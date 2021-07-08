import { Context } from "../../context/Context.ts";
import { Logger } from "../loggers/Logger.ts";

export interface LoggerConstructor {
  new (
    globalContext: Context,
    localContext: undefined,
    options: {
      parameters: Context;
    },
  ): Logger;
}

export class LoggerFactory {
  private readonly globalContext: Context;
  private readonly loggerConstructor: LoggerConstructor;
  private readonly additionalParameters: Context;

  public constructor(
    { globalContext }: {
      globalContext: Context;
    },
    localContext: undefined,
    { loggerConstructor, parameters }: {
      loggerConstructor: LoggerConstructor;
      parameters: Context;
    },
  ) {
    this.globalContext = globalContext;
    this.loggerConstructor = loggerConstructor;
    this.additionalParameters = parameters;
  }

  public produceLogger(
    extraParameters: Context,
  ): Logger {
    const {
      globalContext,
      loggerConstructor,
      additionalParameters,
    } = this;
    const parameters = {
      ...additionalParameters,
      ...extraParameters,
    };
    const logger = new loggerConstructor(
      globalContext,
      undefined,
      { parameters },
    );
    return logger;
  }
}
