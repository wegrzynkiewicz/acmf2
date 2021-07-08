export interface Log {
  channel: string;
  kind: string;
  message: string;
  parameters: Record<string, unknown>;
  severity: number;
  time: Date;
}
