import { LogFilter } from "../filters/LogFilter.ts";
import { LogFormatter } from "../formatters/LogFormatter.ts";
import { Log } from "../Log.ts";
import { LogHandler } from "./LogHandler.ts";

export class StreamLogHandler implements LogHandler {
  private readonly filter: LogFilter;
  private readonly formatter: LogFormatter;
  private readonly stream: WritableStream<string>;

  public constructor(
    { filter, formatter, stream }: {
      filter: LogFilter;
      formatter: LogFormatter;
      stream: WritableStream<string>;
    },
  ) {
    this.filter = filter;
    this.formatter = formatter;
    this.stream = stream;
  }

  public handle(log: Log): void {
    if (this.filter.filtrate(log)) {
      const formattedLog = this.formatter.format(log);
      const writer = this.stream.getWriter();
      writer.write(formattedLog);
    }
  }
}
