import { Config } from "../../config/Config.ts";
import { ServiceRegistry } from "../../context/ServiceRegistry.ts";
import { StandardStreams } from "../../flux/streams/StandardStreams.ts";
import { SeverityLogFilter } from "../filters/SeverityLogFilter.ts";
import { JsonLogFormatter } from "../formatters/JsonLogFormatter.ts";
import { StreamLogHandler } from "../handlers/StreamLogHandler.ts";
import { LogBus } from "./LogBus.ts";

function provideStreamHandler(
  { config, key, stream }: {
    config: Config;
    key: string;
    stream: WritableStream<string>;
  },
): StreamLogHandler[] {
  const enabled = config.get(`APP_LOG_${key}_ENABLED`);
  if (enabled !== "1") {
    return [];
  }
  const minSeverityEntry = config.get(`APP_LOG_${key}_MIN_SEVERITY`);
  const minSeverity = parseInt(minSeverityEntry);
  const formatter = new JsonLogFormatter();
  const filter = new SeverityLogFilter({ minSeverity });
  const handler = new StreamLogHandler({ filter, formatter, stream });
  return [handler];
}

export async function provideLogBus(
  { serviceRegistry }: {
    serviceRegistry: ServiceRegistry;
  },
): Promise<LogBus> {
  const config = await serviceRegistry.fetchByCreator(Config);
  const standardStreams = await serviceRegistry.fetchByName(
    "standardStreams",
  ) as StandardStreams;
  const { stderr, stdout } = standardStreams;
  const logBus = new LogBus({
    handlers: [
      ...provideStreamHandler({ config, key: "STDERR", stream: stderr }),
      ...provideStreamHandler({ config, key: "STDOUT", stream: stdout }),
    ],
  });
  return logBus;
}
