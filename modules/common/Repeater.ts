/**
 * Create a function that will call the callback the indicated number of tries
 * in intervals until the correct result is obtained
 */
export class Repeater<T> {
  private readonly callback: (...args: unknown[]) => Promise<T>;
  private readonly context?: unknown;
  private readonly interval: number;
  private tries: number;

  public constructor(
    { callback, context, interval, tries }: {
      readonly callback: (...args: unknown[]) => Promise<T>;
      readonly context?: unknown;
      readonly interval?: number;
      readonly tries?: number;
    },
  ) {
    this.context = context;
    this.callback = callback;
    this.interval = interval ?? 200;
    this.tries = tries ?? 10;
  }

  public async execute(...args: readonly unknown[]): Promise<T> {
    while (true) {
      try {
        const result = await this.callback.apply(this.context, [...args]) as T;
        return result;
      } catch (error: unknown) {
        this.tries--;
        if (this.tries === 0) {
          throw error;
        }
        await this.sleep(this.interval);
      }
    }
  }

  private async sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
