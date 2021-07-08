import { Log } from "../Log.ts";

export interface LogFilter {
  filtrate: (log: Log) => boolean;
}
