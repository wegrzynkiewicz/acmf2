import { ConfigGetter } from "../config/ConfigGetter.ts";
import { ConfigVariable } from "../config/ConfigVariable.ts";
import { GlobalService } from "../flux/context/global.ts";

export interface LogHandlerConfig {
  enabled: boolean;
  minSeverity: number;
}

export interface LogConfig {
  enabled: boolean;
  stderr: LogHandlerConfig;
  stdout: LogHandlerConfig;
  tags: string[];
}

function createLogHandlerConfig(key: string): ConfigVariable[] {
  const name = key.toLowerCase();
  const enabled: ConfigVariable = {
    key: `LOG_${key}_ENABLED`,
    layout: {
      defaults: "1",
      description: `Enabling the logging to standard ${name} stream.`,
      type: "string",
    },
  };
  const minSeverity: ConfigVariable = {
    key: `LOG_${key}_MIN_SEVERITY`,
    layout: {
      defaults: "9",
      description: `Minimum severity level for standard ${name} stream.`,
      type: "string",
    },
  };
  return [enabled, minSeverity];
}

export const enabledConfigVariable: ConfigVariable = {
  key: "LOG_ENABLED",
  layout: {
    defaults: "1",
    description: "Enabling the logging mechanism.",
    type: "string",
  },
};

export const tagsConfigVariable: ConfigVariable = {
  key: "LOG_TAGS",
  layout: {
    defaults: "",
    description: "Added additional tags to all loggers.",
    type: "string",
  },
};

export const [
  stderrEnabledConfigVariable,
  stderrMinSeverityConfigVariable,
] = createLogHandlerConfig("STDERR");
export const [
  stdoutEnabledConfigVariable,
  stdoutMinSeverityConfigVariable,
] = createLogHandlerConfig("STDOUT");

export async function provideLogConfig(
  { configGetter }: {
    configGetter: ConfigGetter;
  },
): Promise<LogConfig> {
  const logConfig: LogConfig = {
    enabled: configGetter.get(enabledConfigVariable.key) === "1",
    stderr: {
      enabled: configGetter.get(stderrEnabledConfigVariable.key) === "1",
      minSeverity: parseInt(
        configGetter.get(stderrMinSeverityConfigVariable.key),
      ),
    },
    stdout: {
      enabled: configGetter.get(stdoutEnabledConfigVariable.key) === "1",
      minSeverity: parseInt(
        configGetter.get(stdoutMinSeverityConfigVariable.key),
      ),
    },
    tags: configGetter.get(tagsConfigVariable.key).split(","),
  };
  return logConfig;
}

export const logConfigService: GlobalService = {
  globalDeps: ["configGetter"],
  key: "logConfig",
  provider: provideLogConfig,
};
