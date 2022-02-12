export type LoggerParameters = Record<string, unknown>;

export interface LoggerInput {
  channel: string;
  kind: string;
  message: string;
  parameters?: Record<string, unknown>;
}

export interface Logger {
  extend: (parameters: Record<string, unknown>) => void;
  clone: (parameters: Record<string, unknown>) => Logger;
  emergency: (loggerInput: LoggerInput) => void;
  alert: (loggerInput: LoggerInput) => void;
  critical: (loggerInput: LoggerInput) => void;
  error: (loggerInput: LoggerInput) => void;
  warning: (loggerInput: LoggerInput) => void;
  notice: (loggerInput: LoggerInput) => void;
  info: (loggerInput: LoggerInput) => void;
  debug: (loggerInput: LoggerInput) => void;
  silly: (loggerInput: LoggerInput) => void;
}
