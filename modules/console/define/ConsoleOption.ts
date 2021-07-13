import { ConsoleOptionParameter } from "./ConsoleOptionParameter.ts";

export type ConsoleOptionType = "boolean" | "number" | "string";

export class ConsoleOption {
  public readonly description: string;
  public readonly longFlags: string[];
  public readonly name: string;
  public readonly parameter?: ConsoleOptionParameter;
  public readonly required: boolean;
  public readonly shortFlags: string[];
  public readonly type: ConsoleOptionType;

  public constructor(
    { description, longFlags, name, parameter, required, shortFlags, type }: {
      description?: string;
      longFlags?: string[];
      name: string;
      parameter?: ConsoleOptionParameter;
      required?: boolean;
      shortFlags?: string[];
      type: ConsoleOptionType;
    },
  ) {
    this.description = description ?? "";
    this.longFlags = [...longFlags ?? []];
    this.name = name;
    this.parameter = parameter;
    this.required = required ?? false;
    this.shortFlags = [...shortFlags ?? []];
    this.type = type;

    if (this.name === "") {
      throw new Error("Invalid console command name.");
    }

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
