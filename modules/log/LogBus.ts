import { GlobalService } from "../flux/context/global.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { LogHandler } from "./handlers/LogHandler.ts";
import { provideStreamHandler } from "./handlers/streamLogHandler.ts";
import { Log } from "./Log.ts";
import {
  stderrEnabledSymbol,
  stderrMinSeveritySymbol,
  stdoutEnabledSymbol,
  stdoutMinSeveritySymbol,
} from "./logVars.ts";

export interface LogBus {
  dispatch(log: Log): void;
}

export async function provideLogBus(
  {
    [stderrEnabledSymbol]: stderrEnabled,
    [stderrMinSeveritySymbol]: stderrMinSeverity,
    [stdoutEnabledSymbol]: stdoutEnabled,
    [stdoutMinSeveritySymbol]: stdoutMinSeverity,
    standardStreams,
  }: {
    [stderrEnabledSymbol]: boolean;
    [stderrMinSeveritySymbol]: number;
    [stdoutEnabledSymbol]: boolean;
    [stdoutMinSeveritySymbol]: number;
    standardStreams: StandardStreams;
  },
): Promise<LogBus> {
  const { stderr, stdout } = standardStreams;
  const handlers: LogHandler[] = [
    ...provideStreamHandler({ enabled: stderrEnabled, minSeverity: stderrMinSeverity, stream: stderr }),
    ...provideStreamHandler({ enabled: stdoutEnabled, minSeverity: stdoutMinSeverity, stream: stdout }),
  ];
  const dispatch = (log: Log): void => {
    for (const handler of handlers) {
      handler.handle(log);
    }
  };
  return { dispatch };
}

export const logBusService: GlobalService = {
  globalDeps: ["logConfig", "standardStreams"],
  key: "logBus",
  provider: provideLogBus,
};
