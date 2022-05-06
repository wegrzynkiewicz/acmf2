import { ConsoleOutput } from "../define/ConsoleOutput.ts";

export function createStreamConsoleOutput(
  { stderr, stdout }: {
    stderr: WritableStream<string>;
    stdout: WritableStream<string>;
  },
): ConsoleOutput {
  const stderrWriter = stderr.getWriter();
  const stdoutWriter = stdout.getWriter();
  return {
    error(error: Error): void {
      const message = error.stack ?? "";
      stderrWriter.write(`${message}\n`);
    },
    write(line: string): void {
      stdoutWriter.write(line);
    },
    writeLine(line: string): void {
      stdoutWriter.write(`${line}\n`);
    },
  };
}
