import { StandardStreams } from "./StandardStreams.ts";

const textEncoder = new TextEncoder();

export class DenoSTDStreamsProvider {
  public provide(): StandardStreams {
    const streams: StandardStreams = {
      stderr: new WritableStream<string>({
        async write(chunk: string) {
          await Deno.stderr.write(textEncoder.encode(chunk));
        },
      }),
      stdin: new ReadableStream<string>(),
      stdout: new WritableStream<string>({
        async write(chunk: string) {
          await Deno.stdout.write(textEncoder.encode(chunk));
        },
      }),
    };
    return streams;
  }
}
