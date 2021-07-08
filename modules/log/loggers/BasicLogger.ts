import { CurrentDateProvider } from "../../useful/CurrentDateProvider.ts";
import { Log } from "../Log.ts";
import { LogBus } from "../logBus/LogBus.ts";
import { Logger } from "./Logger.ts";
import { LoggerInput } from "./LoggerInput.ts";

export class BasicLogger implements Logger {
  public readonly currentDateProvider: CurrentDateProvider;
  public readonly logBus: LogBus;
  public readonly additionalParameters: Record<string, unknown>;

  public constructor(
    { currentDateProvider, logBus }: {
      currentDateProvider: CurrentDateProvider;
      logBus: LogBus;
    },
    localContext: undefined,
    { parameters }: {
      parameters: Record<string, unknown>;
    },
  ) {
    this.currentDateProvider = currentDateProvider;
    this.logBus = logBus;
    this.additionalParameters = parameters;
  }

  public extend(extendingParameters: Record<string, unknown>): Logger {
    const { additionalParameters, currentDateProvider, logBus } = this;
    const parameters = {
      ...additionalParameters,
      ...extendingParameters,
    };
    const logger = new BasicLogger(
      { currentDateProvider, logBus },
      undefined,
      { parameters },
    );
    return logger;
  }

  public emergency(loggerInput: LoggerInput): void {
    this.log(0, loggerInput);
  }

  public alert(loggerInput: LoggerInput): void {
    this.log(1, loggerInput);
  }

  public critical(loggerInput: LoggerInput): void {
    this.log(2, loggerInput);
  }

  public error(loggerInput: LoggerInput): void {
    this.log(3, loggerInput);
  }

  public warning(loggerInput: LoggerInput): void {
    this.log(4, loggerInput);
  }

  public notice(loggerInput: LoggerInput): void {
    this.log(5, loggerInput);
  }

  public info(loggerInput: LoggerInput): void {
    this.log(6, loggerInput);
  }

  public debug(loggerInput: LoggerInput): void {
    this.log(7, loggerInput);
  }

  public silly(loggerInput: LoggerInput): void {
    this.log(8, loggerInput);
  }

  protected log(
    severity: number,
    loggerInput: LoggerInput,
  ): void {
    const { kind, channel, message, parameters } = loggerInput;
    const { additionalParameters, logBus } = this;
    const log: Log = {
      channel,
      kind,
      message,
      parameters: {
        ...additionalParameters,
        ...parameters,
      },
      severity,
      time: this.currentDateProvider.provideCurrentDate(),
    };
    logBus.dispatch(log);
  }
}
