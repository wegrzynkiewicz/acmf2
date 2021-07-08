import { Logger } from "./Logger.ts";
import { LoggerInput } from "./LoggerInput.ts";

export class NullLogger implements Logger {
  public extend(parameters: Record<string, unknown>): Logger {
    return this;
  }

  public emergency(loggerInput: LoggerInput): void {
    // nothing
  }

  public alert(loggerInput: LoggerInput): void {
    // nothing
  }

  public critical(loggerInput: LoggerInput): void {
    // nothing
  }

  public error(loggerInput: LoggerInput): void {
    // nothing
  }

  public warning(loggerInput: LoggerInput): void {
    // nothing
  }

  public notice(loggerInput: LoggerInput): void {
    // nothing
  }

  public info(loggerInput: LoggerInput): void {
    // nothing
  }

  public debug(loggerInput: LoggerInput): void {
    // nothing
  }

  public silly(loggerInput: LoggerInput): void {
    // nothing
  }
}
