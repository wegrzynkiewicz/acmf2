import { LoggerInput } from "./LoggerInput.ts";

export interface Logger {
  extend: (parameters: Record<string, unknown>) => Logger;
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
