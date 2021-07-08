import type { Log } from "../Log.ts";

export interface LogHandler {
  handle: (log: Log) => void;
}
