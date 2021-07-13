import { LayoutBase, LayoutObject } from "../../layout/layout.ts";

export interface LayoutCommandArgumentBase extends LayoutBase {
}

export interface LayoutCommandArrayArgument<T>
  extends LayoutCommandArgumentBase {
  type: "array";
  items: T extends number ? LayoutCommandNumberArgument
    : T extends string ? LayoutCommandStringArgument
    : never;
}

export interface LayoutCommandBooleanArgument
  extends LayoutCommandArgumentBase {
  type: "boolean";
}

export interface LayoutCommandNumberArgument extends LayoutCommandArgumentBase {
  type: "number";
}

export interface LayoutCommandStringArgument extends LayoutCommandArgumentBase {
  type: "string";
}

export type LayoutCommandArgument =
  | LayoutCommandArrayArgument<string | number>
  | LayoutCommandBooleanArgument
  | LayoutCommandNumberArgument
  | LayoutCommandStringArgument;

export type LayoutCommandArgumentsPropertyType<T> = T extends unknown[]
  ? LayoutCommandArrayArgument<T[number]>
  : T extends boolean ? LayoutCommandBooleanArgument
  : T extends number ? LayoutCommandNumberArgument
  : T extends string ? LayoutCommandStringArgument
  : never;

export type LayoutCommandArgumentsProperties<T> = {
  [K in keyof T]-?: LayoutCommandArgumentsPropertyType<Required<T>[K]>;
};

export interface LayoutCommandArguments<T> extends LayoutObject<T> {
  order: (keyof T)[];
  properties: LayoutCommandArgumentsProperties<T>;
}
