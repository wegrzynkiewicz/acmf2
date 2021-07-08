export class ConsoleOptionParameter {
  public readonly defaults: unknown;
  public readonly name: string;
  public readonly required: boolean;

  public constructor(
    { defaults, name, required }: {
      defaults: unknown;
      name: string;
      required?: boolean;
    },
  ) {
    this.defaults = defaults;
    this.name = name;
    this.required = required ?? false;
  }

  public assert(value: unknown): void {
    if (value === "" && this.required) {
      throw new Error(
        `Required option parameter named (${this.name}) is empty.`,
      );
    }
  }
}
