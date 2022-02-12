import { GlobalService } from "../../flux/context/GlobalService.ts";
import { StandardStreams } from "../../flux/streams/StandardStreams.ts";
import { LogHandler } from "../handlers/LogHandler.ts";
import { provideStreamHandler } from "../handlers/StreamLogHandler.ts";
import { Log } from "../Log.ts";
import { LogConfig } from "../LogConfig.ts";

export interface LogBus {
  dispatch(log: Log): void;
}

export const logBusService: GlobalService = {
  globalDeps: ["logConfig", "standardStreams"],
  key: "logBus",
  provider: provideLogBus,
};

export async function provideLogBus(
  { logConfig, standardStreams }: {
    logConfig: LogConfig;
    standardStreams: StandardStreams;
  },
): Promise<LogBus> {
  const { stderr, stdout } = standardStreams;
  const handlers: LogHandler[] = [
    ...provideStreamHandler({ config: logConfig.stderr, stream: stderr }),
    ...provideStreamHandler({ config: logConfig.stdout, stream: stdout }),
  ];
  const dispatch = (log: Log): void => {
    for (const handler of handlers) {
      handler.handle(log);
    }
  };
  return { dispatch };
}
