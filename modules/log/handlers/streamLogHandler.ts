import { provideSeverityLogFilter } from "../filters/severityLogFilter.ts";
import { provideJsonLogFormatter } from "../formatters/jsonLogFormatter.ts";
import { Log } from "../Log.ts";
import { LogHandler } from "./LogHandler.ts";

export function provideStreamHandler(
  { enabled, minSeverity, stream }: {
    enabled: boolean;
    minSeverity: number;
    stream: WritableStream<string>;
  },
): LogHandler[] {
  if (enabled === false) {
    return [];
  }
  const formatter = provideJsonLogFormatter();
  const filter = provideSeverityLogFilter({ minSeverity });
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
