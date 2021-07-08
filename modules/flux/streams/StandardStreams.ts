export interface StandardStreams {
  stderr: WritableStream<string>;
  stdin: ReadableStream<string>;
  stdout: WritableStream<string>;
}
