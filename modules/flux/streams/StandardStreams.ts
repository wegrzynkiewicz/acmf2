import { GlobalService } from "../context/global.ts";
import { provideDenoSTDStreams } from "./provideDenoSTDStreams.ts";

export interface StandardStreams {
  stderr: WritableStream<string>;
  stdin: ReadableStream<string>;
  stdout: WritableStream<string>;
}

export const standardStreamsService: GlobalService = {
  globalDeps: [],
  key: "standardStreams",
  provider: provideStandardStreams,
};

export async function provideStandardStreams(): Promise<StandardStreams> {
  const standardStreams = provideDenoSTDStreams();
  return standardStreams;
}
