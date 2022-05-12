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

export interface LNullable {
  readonly nullable?: boolean;
}

export interface LBase {
  readonly id?: string;
  readonly description?: string;
  readonly metadata?: Record<string, unknown>;
  readonly title?: string;
}

export interface LAny extends LBase {
  readonly type: "any";
}

export interface LArray<T> extends LBase, LNullable {
  readonly type: "array";
  readonly items: LDescriptor<T>;
}

export interface LBoolean extends LBase, LNullable {
  readonly defaults?: boolean;
  readonly type: "boolean";
}

export interface LEnumerable extends LBase, LNullable {
  readonly defaults?: string;
  readonly type: "enumerable";
  readonly values: ReadonlyArray<string>;
}

export interface LFloat extends LBase, LNullable {
  readonly defaults?: number;
  readonly type: "float";
}

export interface LInteger extends LBase, LNullable {
  readonly defaults?: number;
  readonly type: "integer";
}

export interface LNull extends LBase {
  readonly type: "null";
}

export type LNumber = LFloat | LInteger;

export type LObjectRequired<T> =
  & {
    readonly [K in keyof T]+?: boolean;
  }
  & (unknown extends T ? { [K: string]: boolean } : Record<never, never>);

export type LObjectProperties<T> =
  & {
    readonly [K in keyof T]-?: LDescriptor<T[K]>;
  }
  & (unknown extends T ? { [K: string]: LUnknown } : Record<never, never>);

export interface LObject<T> extends LBase, LNullable {
  readonly properties: LObjectProperties<T>;
  readonly required?: LObjectRequired<T>;
  readonly type: "object";
}

export type LPrimitive =
  | LBoolean
  | LFloat
  | LInteger
  | LString;

export interface LReference extends LBase, LNullable {
  readonly link: string;
  readonly type: "reference";
}

export interface LString extends LBase, LNullable {
  readonly defaults?: string;
  readonly restrictions?: {
    readonly maxLength?: number;
    readonly minLength?: number;
  };
  readonly type: "string";
}

export interface LDictionary<T> extends LBase, LNullable {
  readonly type: "dictionary";
  readonly items: LDescriptor<T>;
}

export type LFormat<T> = null;

export interface LEncoded<T> extends LBase, LNullable {
  readonly type: "encoded";
  readonly format: LFormat<T>;
}

export type LRecord<T> =
  | LObject<T>
  | LDictionary<T>;

export type LInferable<T> = unknown extends T ? LUnknown
  : [T] extends [Array<infer U>] ? LArray<U>
  : [T] extends [null | undefined] ? LNull
  : [T] extends [boolean] ? LBoolean
  : [T] extends [string] ? LString
  : [T] extends [number] ? LNumber
  : T extends Record<string, infer U> ? LDictionary<U>
  : LObject<T>;

export type LDescriptor<T> = (
  | LAny
  | LEnumerable
  | LReference
  | LInferable<Exclude<T, null | undefined>>
);

export type LUnknown = (
  | LAny
  | LArray<unknown>
  | LBoolean
  | LEnumerable
  | LFloat
  | LDictionary<unknown>
  | LInteger
  | LNull
  | LObject<unknown>
  | LString
  | LReference
);
