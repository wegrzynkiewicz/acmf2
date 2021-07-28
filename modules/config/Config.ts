import { Layout } from "../layout/layout.ts";

export class Config {
  private readonly entries: Map<string, Layout>;
  private readonly values = new Map<string, unknown>();

  public constructor(
    { entries }: {
      entries: Map<string, Layout>;
    },
  ) {
    this.entries = entries;
  }

  public get(configKey: string): unknown {
    const configValue = this.values.get(configKey);
    if (configValue === undefined) {
      throw new Error(`Cannot get config key named (${configKey}).`);
    }
    return configValue;
  }

  public set(configKey: string, configValue: unknown): void {
    if (!this.entries.has(configKey)) {
      throw new Error(
        `Cannot set unregistered config key named (${configKey}).`,
      );
    }
    if (this.values.has(configKey)) {
      throw new Error(
        `Cannot set already set up config key named (${configKey}).`,
      );
    }
    this.values.set(configKey, configValue);
  }
}
