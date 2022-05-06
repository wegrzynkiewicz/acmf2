import { EnvironmentVariable } from "../flux/env/EnvironmentVariable.ts";

export const enabledSymbol = Symbol();
export const enabledVariable: EnvironmentVariable = {
  key: enabledSymbol,
  layout: {
    defaults: "1",
    description: "Enabling the logging mechanism.",
    type: "string",
  },
  variable: "LOG_ENABLED",
};

export const tagsSymbol = Symbol();
export const tagsVariable: EnvironmentVariable = {
  key: tagsSymbol,
  layout: {
    defaults: "",
    description: "Added additional tags to all loggers.",
    type: "string",
  },
  variable: "LOG_TAGS",
};

export const stderrEnabledSymbol = Symbol();
export const stderrEnabledVariable: EnvironmentVariable = {
  key: stderrEnabledSymbol,
  layout: {
    defaults: "1",
    description: `Enabling the logging to standard stderr stream.`,
    type: "string",
  },
  variable: `LOG_STDERR_ENABLED`,
};

export const stderrMinSeveritySymbol = Symbol();
export const stderrMinSeverityVariable: EnvironmentVariable = {
  key: stderrMinSeveritySymbol,
  layout: {
    defaults: "9",
    description: `Minimum severity level for standard stderr stream.`,
    type: "string",
  },
  variable: `LOG_STDERR_MIN_SEVERITY`,
};

export const stdoutEnabledSymbol = Symbol();
export const stdoutEnabledVariable: EnvironmentVariable = {
  key: stdoutEnabledSymbol,
  layout: {
    defaults: "1",
    description: `Enabling the logging to standard stdout stream.`,
    type: "string",
  },
  variable: `LOG_STDOUT_ENABLED`,
};

export const stdoutMinSeveritySymbol = Symbol();
export const stdoutMinSeverityVariable: EnvironmentVariable = {
  key: Symbol(),
  layout: {
    defaults: "9",
    description: `Minimum severity level for standard stdout stream.`,
    type: "string",
  },
  variable: `LOG_STDOUT_MIN_SEVERITY`,
};
