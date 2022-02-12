import {
  LayoutBoolean,
  LayoutNumber,
  LayoutString,
} from "../../layout/layout.ts";
import { ConsoleOptionParameter } from "./ConsoleOptionParameter.ts";

export interface ConsoleFlags {
  parameter?: ConsoleOptionParameter;
  longFlags?: string[];
  shortFlags?: string[];
}

export type LayoutBooleanConsoleOption = LayoutBoolean & ConsoleFlags;
export type LayoutStringConsoleOption = LayoutString & ConsoleFlags;
export type LayoutNumberConsoleOption = LayoutNumber & ConsoleFlags;

type Positive<T> = T extends string ? LayoutStringConsoleOption
  : T extends boolean ? LayoutBooleanConsoleOption
  : T extends number ? LayoutNumberConsoleOption
  : never;

export type LayoutConsoleOption<T> = Positive<Exclude<T, null | undefined>>;

export type LayoutConsoleOptions<T> = {
  properties: {
    +readonly [K in keyof T]-?: LayoutConsoleOption<T[K]>;
  };
  required?: {
    +readonly [K in keyof T]-?: boolean;
  };
  type: "object";
};

export class ConsoleOptionX {
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
