import { Log } from "../Log.ts";
import { LogFormatter } from "./LogFormatter.ts";

export class JsonLogFormatter implements LogFormatter {
  public format(log: Log): string {
    const { message, parameters, severity, time } = log;
    const structure = { time, severity, message, ...parameters };
    const json = JSON.stringify(structure);

    return `${json}\n`;
  }
}
