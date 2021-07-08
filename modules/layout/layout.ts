import { JSONSchema7 } from "../schema/jsonSchema7.ts";

export type LayoutTypeName =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

interface LayoutBase extends JSONSchema7 {
  description?: string;
  title?: string;
  type: LayoutTypeName;
}

type LayoutType = unknown[] | number | object | string;

type LayoutPropertyType<T> = T extends LayoutType[] ? LayoutArray<T[number]>
  : T extends number ? LayoutNumber
  : T extends string ? LayoutString
  : LayoutObject<T>;

type LayoutObjectProperties<T> = {
  [K in keyof Required<T>]: LayoutPropertyType<Required<T[K]>>;
};

interface LayoutArray<T> extends LayoutBase {
  type: "array";
  items: T extends number ? LayoutNumber
  : T extends string ? LayoutString
  : LayoutObject<T>;
}

interface LayoutObject<T> extends LayoutBase {
  properties: LayoutObjectProperties<T>;
  required: string[];
}

interface LayoutNumber extends LayoutBase {
  default?: number;
  type: "number";
}

interface LayoutString extends LayoutBase {
  default?: string;
  type: "string";
}
