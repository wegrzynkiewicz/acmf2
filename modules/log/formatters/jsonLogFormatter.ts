import { Log } from "../Log.ts";
import { LogFormatter } from "./LogFormatter.ts";

export function provideJsonLogFormatter(): LogFormatter {
  const format = (log: Log): string => {
    const { message, data, severity } = log;
    const structure = { severity, msg: message, ...data };
    const json = JSON.stringify(structure);

    return `${json}\n`;
  };
  return { format };
}
