import { SeverityLogFilter } from "../filters/SeverityLogFilter.ts";
import { JsonLogFormatter } from "../formatters/JsonLogFormatter.ts";
import { Log } from "../Log.ts";
import { LogHandlerConfig } from "../LogConfig.ts";
import { LogHandler } from "./LogHandler.ts";

export function provideStreamHandler(
  { config, stream }: {
    config: LogHandlerConfig;
    stream: WritableStream<string>;
  },
): LogHandler[] {
  const { enabled, minSeverity } = config;
  if (enabled === false) {
    return [];
  }
  const formatter = new JsonLogFormatter();
  const filter = new SeverityLogFilter({ minSeverity });
  const handle = (log: Log): void => {
    if (filter.filtrate(log)) {
      const formattedLog = formatter.format(log);
      const writer = stream.getWriter();
      writer.write(formattedLog);
    }
  };
  const logHandler = { handle };
  return [logHandler];
}
