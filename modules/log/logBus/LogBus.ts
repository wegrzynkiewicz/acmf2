import { LogHandler } from "../handlers/LogHandler.ts";
import type { Log } from "../Log.ts";

export class LogBus {
  private readonly handlers: LogHandler[];

  public constructor(
    { handlers }: {
      handlers: LogHandler[];
    },
  ) {
    this.handlers = [...handlers];
  }

  public dispatch(log: Log): void {
    for (const handler of this.handlers) {
      handler.handle(log);
    }
  }
}
