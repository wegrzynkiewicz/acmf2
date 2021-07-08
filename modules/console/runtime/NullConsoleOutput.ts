import { ConsoleOutput } from "../define/ConsoleOutput.ts";

export class NullConsoleOutput implements ConsoleOutput {
  public error(): void {
    // nothing
  }

  public write(): void {
    // nothing
  }

  public writeLine(): void {
    // nothing
  }
}
