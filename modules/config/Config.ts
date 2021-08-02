export class Config {
  private readonly values: Map<string, unknown>;

  public constructor(
    { values }: {
      values: Map<string, unknown>;
    },
  ) {
    this.values = values;
  }

  public get(configKey: string): unknown {
    const configValue = this.values.get(configKey);
    if (configValue === undefined) {
      throw new Error(`Cannot get config key named (${configKey}).`);
    }
    return configValue;
  }
}
