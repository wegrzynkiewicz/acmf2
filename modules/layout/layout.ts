type IsNullable<T> = (
  unknown extends T ? boolean
    : null extends T ? true
    : false
);
type IsRequired<T> = (
  unknown extends T ? boolean
    : undefined extends T ? false
    : true
);

export interface LayoutNullable {
  readonly nullable?: boolean;
}

export interface LayoutBase {
  readonly id?: string;
  readonly description?: string;
  readonly metadata?: Record<string, unknown>;
  readonly title?: string;
}

export interface LayoutAny extends LayoutBase {
  readonly type: "any";
}

export interface LayoutArray<T> extends LayoutBase, LayoutNullable {
  readonly type: "array";
  readonly items: LayoutDescriptor<T>;
}

export interface LayoutBoolean extends LayoutBase, LayoutNullable {
  readonly defaults?: boolean;
  readonly type: "boolean";
}

export interface LayoutEnumerable extends LayoutBase, LayoutNullable {
  readonly defaults?: string;
  readonly type: "enumerable";
  readonly values: ReadonlyArray<string>;
}

export interface LayoutFloat extends LayoutBase, LayoutNullable {
  readonly defaults?: number;
  readonly type: "float";
}

export interface LayoutInteger extends LayoutBase, LayoutNullable {
  readonly defaults?: number;
  readonly type: "integer";
}

export interface LayoutNull extends LayoutBase {
  readonly type: "null";
}

export type LayoutNumber = LayoutFloat | LayoutInteger;

export type LayoutObjectRequired<T> =
  & {
    readonly [K in keyof T]+?: boolean;
  }
  & (unknown extends T ? { [K: string]: boolean } : {});

export type LayoutObjectProperties<T> =
  & {
    readonly [K in keyof T]-?: LayoutDescriptor<T[K]>;
  }
  & (unknown extends T ? { [K: string]: Layout } : {});

export interface LayoutObject<T> extends LayoutBase, LayoutNullable {
  readonly properties: LayoutObjectProperties<T>;
  readonly required?: LayoutObjectRequired<T>;
  readonly type: "object";
}

export type LayoutPrimitive =
  | LayoutBoolean
  | LayoutFloat
  | LayoutInteger
  | LayoutString;

export interface LayoutReference extends LayoutBase, LayoutNullable {
  readonly link: string;
  readonly type: "reference";
}

export interface LayoutString extends LayoutBase, LayoutNullable {
  readonly defaults?: string;
  readonly restrictions?: {
    readonly maxLength?: number;
    readonly minLength?: number;
  };
  readonly type: "string";
}

export interface LayoutDictionary<T> extends LayoutBase, LayoutNullable {
  readonly type: "dictionary";
  readonly items: LayoutDescriptor<T>;
}

export type LayoutRecord<T> =
  | LayoutObject<T>
  | LayoutDictionary<T>;

export type LayoutInferable<T> = unknown extends T ? Layout
  : [T] extends [Array<infer U>] ? LayoutArray<U>
  : [T] extends [null | undefined] ? LayoutNull
  : [T] extends [boolean] ? LayoutBoolean
  : [T] extends [string] ? LayoutString
  : [T] extends [number] ? LayoutNumber
  : T extends Record<string, infer U> ? LayoutDictionary<U>
  : LayoutObject<T>;

export type LayoutDescriptor<T> = (
  | LayoutAny
  | LayoutEnumerable
  | LayoutReference
  | LayoutInferable<Exclude<T, null | undefined>>
);

export type Layout = (
  | LayoutAny
  | LayoutArray<unknown>
  | LayoutBoolean
  | LayoutEnumerable
  | LayoutFloat
  | LayoutDictionary<unknown>
  | LayoutInteger
  | LayoutNull
  | LayoutObject<unknown>
  | LayoutString
  | LayoutReference
);
