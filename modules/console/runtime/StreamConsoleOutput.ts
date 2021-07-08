import { ConsoleOutput } from "../define/ConsoleOutput.ts";

export class StreamConsoleOutput implements ConsoleOutput {
  private readonly stderr: WritableStreamDefaultWriter<string>;
  private readonly stdout: WritableStreamDefaultWriter<string>;

  public constructor(
    { stderr, stdout }: {
      stderr: WritableStream<string>;
      stdout: WritableStream<string>;
    },
  ) {
    this.stderr = stderr.getWriter();
    this.stdout = stdout.getWriter();
  }

  public error(error: Error): void {
    const message = error.stack ?? "";
    this.stderr.write(`${message}\n`);
  }

  public write(line: string): void {
    this.stdout.write(line);
  }

  public writeLine(line: string): void {
    this.stdout.write(`${line}\n`);
  }
}
