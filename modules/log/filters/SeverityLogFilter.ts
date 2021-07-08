import { Log } from "../Log.ts";
import { LogFilter } from "./LogFilter.ts";

export class SeverityLogFilter implements LogFilter {
  public minSeverity: number;

  public constructor(
    { minSeverity }: {
      minSeverity: number;
    },
  ) {
    this.minSeverity = minSeverity;
  }

  public filtrate(log: Log): boolean {
    const { severity } = log;
    if (severity > this.minSeverity) {
      return false;
    }
    return true;
  }
}
