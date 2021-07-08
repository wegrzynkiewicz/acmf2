import { ConsoleOptionParameter } from "./ConsoleOptionParameter.ts";

export class ConsoleOption {
  public readonly description: string;
  public readonly longFlags: string[];
  public readonly name: string;
  public readonly parameter?: ConsoleOptionParameter;
  public readonly shortFlags: string[];

  public constructor(
    { description, longFlags, name, parameter, shortFlags }: {
      description?: string;
      longFlags?: string[];
      name: string;
      parameter?: ConsoleOptionParameter;
      shortFlags?: string[];
    },
  ) {
    this.description = description ?? "";
    this.longFlags = [...longFlags ?? []];
    this.name = name;
    this.parameter = parameter;
    this.shortFlags = [...shortFlags ?? []];

    if (this.longFlags.length === 0 && this.shortFlags.length === 0) {
      throw new Error(`Option named (${this.name}) must have flag.`);
    }
  }

  public assert(value: unknown): void {
    if (this.parameter) {
      this.parameter.assert(value);
    } else if (typeof value !== "boolean") {
      throw new Error(
        `Option named (${this.name}) received value, which not expected.`,
      );
    }
  }
}
