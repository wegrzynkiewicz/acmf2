import { LayoutObject } from "../layout/layout.ts";

function createLogHandlerConfig(
  { key, name }: {
    key: string;
    name: string;
  },
): LayoutObject<LogHandlerConfig> {
  return {
    properties: {
      enabled: {
        description: `Enabling the logging to standard ${name} stream.`,
        metadata: {
          configEntryKey: `APP_LOG_${key}_MIN_SEVERITY`,
          serialization: {
            type: "binaryChar",
          },
        },
        type: "boolean",
      },
      minSeverity: {
        description: `Minimum severity level for standard ${name} stream.`,
        metadata: {
          configEntryKey: `APP_LOG_${key}_MIN_SEVERITY`,
          serialization: {
            type: "integer",
          },
        },
        type: "integer",
      },
    },
    type: "object",
  };
}

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

export const logConfigLayout: LayoutObject<LogConfig> = {
  properties: {
    enabled: {
      description: "Enabling the logging mechanism.",
      metadata: {
        configEntryKey: "APP_LOG_ENABLED",
        serialization: {
          type: "binaryChar",
        },
      },
      type: "boolean",
    },
    stderr: createLogHandlerConfig({ key: "STDERR", name: "stderr" }),
    stdout: createLogHandlerConfig({ key: "STDOUT", name: "stdout" }),
    tags: {
      description: "Added additional tags to all loggers.",
      items: {
        type: "string",
      },
      metadata: {
        configEntryKey: "APP_LOG_TAGS",
        serialization: {
          type: "json",
        },
      },
      type: "array",
    },
  },
  type: "object",
};
