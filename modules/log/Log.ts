export interface Log {
  channel: string;
  data: Record<string, unknown>;
  kind: string;
  message: string;
  severity: number;
  time: Date;
}
