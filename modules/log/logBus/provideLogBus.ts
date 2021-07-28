import { StandardStreams } from "../../flux/streams/StandardStreams.ts";
import { SeverityLogFilter } from "../filters/SeverityLogFilter.ts";
import { JsonLogFormatter } from "../formatters/JsonLogFormatter.ts";
import { StreamLogHandler } from "../handlers/StreamLogHandler.ts";
import { LogConfig, LogHandlerConfig } from "../LogConfig.ts";
import { LogBus } from "./LogBus.ts";

function provideStreamHandler(
  { config, stream }: {
    config: LogHandlerConfig;
    stream: WritableStream<string>;
  },
): StreamLogHandler[] {
  const { enabled, minSeverity } = config;
  if (!enabled) {
    return [];
  }
  const formatter = new JsonLogFormatter();
  const filter = new SeverityLogFilter({ minSeverity });
  const handler = new StreamLogHandler({ filter, formatter, stream });
  return [handler];
}

export async function provideLogBus(
  { logConfig, standardStreams }: {
    logConfig: LogConfig;
    standardStreams: StandardStreams;
  },
): Promise<LogBus> {
  const { stderr, stdout } = standardStreams;
  const logBus = new LogBus({
    handlers: [
      ...provideStreamHandler({ config: logConfig.stderr, stream: stderr }),
      ...provideStreamHandler({ config: logConfig.stdout, stream: stdout }),
    ],
  });
  return logBus;
}
