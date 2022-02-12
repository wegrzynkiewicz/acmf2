import {
  LayoutArray,
  LayoutBoolean,
  LayoutNumber,
  LayoutString,
} from "../../layout/layout.ts";

type Positive<T> = T extends Array<infer U>
  ? (U extends boolean | number | string ? LayoutArray<U> : never)
  : T extends string ? LayoutString
  : T extends boolean ? LayoutBoolean
  : T extends number ? LayoutNumber
  : never;

export type LayoutConsoleArgument<T> = Positive<Exclude<T, null | undefined>>;

export type LayoutConsoleArguments<T> = {
  properties: {
    +readonly [K in keyof T]-?: LayoutConsoleArgument<T[K]>;
  };
  required?: {
    +readonly [K in keyof T]-?: boolean;
  };
  type: "object";
};

type test = string extends never ? true : false;

export class ConsoleArgumentX {
  public readonly description: string;
  public readonly defaults: unknown;
  public readonly name: string;
  public readonly required: boolean;
  public readonly rest: boolean;
  public readonly type: ConsoleArgumentType;

  public constructor(
    { defaults, description, name, required, type }: {
      defaults: unknown;
      description?: string;
      name: string;
      required?: boolean;
      type: ConsoleArgumentType;
    },
  ) {
    this.description = description ?? "";
    this.defaults = defaults;
    this.name = name;
    this.required = required ?? false;
    this.rest = type === "array";
    this.type = type;
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
