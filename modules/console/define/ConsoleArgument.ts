import { LayoutArray, LayoutBoolean, LayoutNumber, LayoutString } from "../../layout/layout.ts";

type LayoutUnknownConsoleArgument =
  | LayoutString
  | LayoutBoolean
  | LayoutNumber
  | LayoutArray<unknown>;

type Positive<T> = T extends Array<infer U> ? (U extends boolean | number | string ? LayoutArray<U> : never)
  : T extends string ? LayoutString
  : T extends boolean ? LayoutBoolean
  : T extends number ? LayoutNumber
  : never;

export type LayoutConsoleArgument<T> = Positive<Exclude<T, null | undefined>>;

export type LayoutConsoleArguments<T> = {
  properties:
    & {
      +readonly [K in keyof T]-?: LayoutConsoleArgument<T[K]>;
    }
    & (unknown extends T ? { [K: string]: LayoutUnknownConsoleArgument } : {});
  required?:
    & {
      +readonly [K in keyof T]-?: boolean;
    }
    & (unknown extends T ? { [K: string]: boolean } : {});
  type: "object";
};
