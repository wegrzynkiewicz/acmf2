export interface LoggerInput {
  channel: string;
  kind: string;
  message: string;
  parameters?: Record<string, unknown>;
}
