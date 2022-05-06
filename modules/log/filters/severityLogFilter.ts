import { Log } from "../Log.ts";
import { LogFilter } from "./LogFilter.ts";

export function provideSeverityLogFilter(
  { minSeverity }: {
    minSeverity: number;
  },
): LogFilter {
  const filtrate = (log: Log): boolean => {
    const { severity } = log;
    if (severity > minSeverity) {
      return false;
    }
    return true;
  };
  return { filtrate };
}
