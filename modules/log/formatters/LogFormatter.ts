import type { Log } from "../Log.ts";

export interface LogFormatter {
  format: (log: Log) => string;
}
