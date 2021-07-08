export class ConsoleArgument {
  public readonly defaults?: unknown;
  public readonly description: string;
  public readonly name: string;
  public readonly required: boolean;
  public readonly rest: boolean;

  public constructor(
    { defaults, description, name, rest, required }: {
      defaults?: unknown;
      description?: string;
      name: string;
      rest?: boolean;
      required?: boolean;
    },
  ) {
    this.defaults = defaults;
    this.description = description ?? "";
    this.name = name;
    this.required = required ?? false;
    this.rest = rest ?? false;
  }

  public assert(value: unknown): void {
    const { required, rest, name } = this;
    if (rest) {
      if (!Array.isArray(value)) {
        throw new Error(`Rest argument named (${name}) is not array.`);
      }
      if (required && value.length && value.length === 0) {
        throw new Error(
          `Required rest argument named (${name}) is empty array.`,
        );
      }
    }
    if (value === "" && required) {
      throw new Error(`Required argument named (${name}) is empty.`);
    }
  }

  public digValueFromArray(args: string[]): unknown {
    const { defaults, required, rest, name } = this;
    if (args.length === 0) {
      if (required) {
        throw new Error(`Not passed required argument named (${name}).`);
      }
      if (rest && defaults === null) {
        return [];
      }
      return defaults;
    }
    if (rest) {
      return args.splice(0);
    }
    return args.shift();
  }
}
