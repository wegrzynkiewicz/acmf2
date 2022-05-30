import { Deferred, deferred } from "../../deps.ts";

export class PromiseCollector {
  private readonly promises = new Set<Promise<unknown>>();
  public resolved = false;
  private main: Deferred<void> = deferred();

  public constructor(promises?: Promise<unknown>[]) {
    if (promises === undefined) {
      this.resolve();
      return;
    }
    for (const promise of promises) {
      this.add(promise);
    }
  }

  public add(promise: Promise<unknown>) {
    if (this.resolved) {
      this.refresh();
    }
    this.promises.add(promise);
    promise
      .catch((error) => this.reject(error))
      .then(() => this.mark(promise));
  }

  public async waitForAll(): Promise<void> {
    return this.main;
  }

  private mark(promise: Promise<unknown>): void {
    if (this.promises.has(promise)) {
      this.promises.delete(promise);
      if (this.promises.size === 0) {
        this.resolve();
      }
    }
  }

  private refresh(): void {
    this.resolved = false;
    this.main = deferred();
  }

  private reject(error: unknown): void {
    this.resolved = true;
    this.promises.clear();
    this.main.reject(error);
  }

  private resolve(): void {
    this.resolved = true;
    this.main.resolve();
  }
}
