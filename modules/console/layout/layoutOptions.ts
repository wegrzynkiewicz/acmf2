import { LayoutBase, LayoutObject } from "../../layout/layout.ts";

export interface LayoutCommandOptionBase extends LayoutBase {
  longFlags: string[];
  shortFlags: string[];
}

export interface LayoutCommandOptionWithParameterBase
  extends LayoutCommandOptionBase {
  parameterRequired: boolean;
}

export interface LayoutCommandBooleanOption extends LayoutCommandOptionBase {
  type: "boolean";
}

export interface LayoutCommandNumberOption
  extends LayoutCommandOptionWithParameterBase {
  type: "number";
}

export interface LayoutCommandStringOption
  extends LayoutCommandOptionWithParameterBase {
  type: "string";
}

export type LayoutCommandOption =
  | LayoutCommandBooleanOption
  | LayoutCommandNumberOption
  | LayoutCommandStringOption;

export type LayoutCommandOptionsPropertyType<T> = T extends boolean
  ? LayoutCommandBooleanOption
  : T extends number ? LayoutCommandNumberOption
  : T extends string ? LayoutCommandStringOption
  : never;

export type LayoutCommandOptionsProperties<T> = {
  [K in keyof T]-?: LayoutCommandOptionsPropertyType<Required<T>[K]>;
};

export interface LayoutCommandOptions<T extends object>
  extends LayoutObject<T> {
  properties: LayoutCommandOptionsProperties<T>;
}
