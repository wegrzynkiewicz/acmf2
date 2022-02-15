import { Logger } from "./Logger.ts";

export class NullLogger implements Logger {
  public clone(): Logger {
    return new NullLogger();
  }

  public extend(): void {
    // nothing
  }

  public emergency(): void {
    // nothing
  }

  public alert(): void {
    // nothing
  }

  public critical(): void {
    // nothing
  }

  public error(): void {
    // nothing
  }

  public warning(): void {
    // nothing
  }

  public notice(): void {
    // nothing
  }

  public info(): void {
    // nothing
  }

  public debug(): void {
    // nothing
  }

  public silly(): void {
    // nothing
  }
}

export const nullLogger = new NullLogger();
