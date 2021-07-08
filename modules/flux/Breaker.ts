export interface BreakerOptions {
  args?: Record<string, number | string>;
  error?: unknown;
  kind: string;
  message?: string;
  status: number;
}

export class Breaker extends Error {
  public readonly args?: Record<string, number | string>;
  public readonly error?: unknown;
  public readonly kind: string;
  public readonly status: number;

  public constructor(
    { args, error, kind, message, status }: BreakerOptions,
  ) {
    if (message === undefined) {
      message = kind;
    }
    super(message);
    this.args = args;
    this.kind = kind;
    this.error = error;
    this.status = status;
    if (args !== undefined) {
      this.stack += `\n---\nArguments: \n${JSON.stringify(args)}`;
    }
    if (error instanceof Error) {
      this.stack += `\n---\nPrevious error: \n${error.stack ?? error.message}`;
    }
  }
}
