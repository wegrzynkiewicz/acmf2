import { LBoolean, LDescriptor, LFloat, LInteger, LNull, LNumber, LObject, LString, LUnknown } from "../layout.ts";

export class LInvalidError extends Error {
  public constructor(
    { context, kind }: {
      context: LContext;
      kind: string;
    },
  ) {
    super(kind);
    this.name = "LInvalidError";
  }
}

export class LDataError extends Error {
  public readonly kind: string;
  public constructor(
    { context, kind }: {
      context: LContext;
      kind: string;
    },
  ) {
    super(kind);
    this.kind = kind;
    this.name = "LDataError";
  }
}

export interface LArgs<T> {
  data: unknown;
  layout: LDescriptor<T>;
}

export interface LContext {
  errors: Error[];
  rootData: unknown;
}

export interface PositiveResult<T> {
  errors: LDataError[];
  valid: true;
  sanitized: T;
}

export interface NegativeResult {
  errors: LDataError[];
  valid: false;
}

export class LError extends Error {
  public readonly errors: LDataError[];
  public constructor(
    { context, errors, kind }: {
      context: LContext;
      errors: LDataError[];
      kind: string;
    },
  ) {
    super(kind);
    this.errors = errors;
    this.name = "LError";
  }
}

export type LResolverResult<T> = PositiveResult<T> | NegativeResult;

export interface LResolverOptions {
  strictMode?: boolean;
}

export class LResolver {
  readonly #strictMode;

  public constructor(options?: LResolverOptions) {
    const opts = options ?? {};
    this.#strictMode = opts.strictMode ?? true;
  }

  public assert(args: LArgs<unknown>): void {
    this.resolve(args);
  }

  public resolve<T>({ data, layout }: LArgs<T>): T {
    const context: LContext = {
      errors: [],
      rootData: data,
    };
    try {
      const value = this.#resolveAll({ context, data, layout });
      return value as T;
    } catch (error: unknown) {
      if (error instanceof LDataError) {
        throw new LError({ errors: [error], context, kind: "test123" });
      }
      throw error;
    }
  }

  public validate<T>(args: LArgs<T>): LResolverResult<T> {
    try {
      const sanitized = this.resolve(args);
      return {
        errors: [],
        sanitized,
        valid: true,
      };
    } catch (error: unknown) {
      if (error instanceof LError) {
        return {
          errors: [...error.errors],
          valid: false,
        };
      }
      throw error;
    }
  }

  #resolveAll(
    { context, data, layout }: {
      context: LContext;
      data: unknown;
      layout: LUnknown;
    },
  ): unknown {
    switch (layout.type) {
      case "any":
        return data;
      case "array":
        break;
      case "boolean":
        return this.resolveBoolean({ context, data, layout });
      case "dictionary":
        break;
      case "float":
        return this.resolveFloat({ context, data, layout });
      case "integer":
        return this.resolveInteger({ context, data, layout });
      case "null":
        return this.resolveNull({ context, data, layout });
      case "object":
        return this.resolveObject({ context, data, layout });
      case "reference":
        break;
      case "string":
        return this.resolveString({ context, data, layout });
      default:
        throw new LInvalidError({
          kind: "unexpected-type",
          context,
        });
    }
  }

  protected resolveBoolean(
    { context, data, layout }: {
      context: LContext;
      data: unknown;
      layout: LBoolean;
    },
  ): boolean | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LDataError({ context, kind: "unexpected-null" });
    }
    if (this.#strictMode === true) {
      if (typeof data !== "boolean") {
        throw new LDataError({ context, kind: "unexpected-type" });
      }
      return data;
    }
    switch (data) {
      case true:
      case "true":
      case 1:
      case "1":
      case "on":
      case "enabled":
        return true;
      case false:
      case "false":
      case 0:
      case "0":
      case "off":
      case "disabled":
        return false;
      default:
        // nothing
    }
    throw new LDataError({ context, kind: "unexpected-value" });
  }

  protected resolveFloat(
    { context, data, layout }: {
      context: LContext;
      data: unknown;
      layout: LFloat;
    },
  ): number | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LDataError({ context, kind: "unexpected-null" });
    }
    const number = this.resolveNumber({ context, data, layout });
    return number;
  }

  protected resolveInteger(
    { context, data, layout }: {
      data: unknown;
      context: LContext;
      layout: LInteger;
    },
  ): number | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LDataError({ context, kind: "unexpected-null" });
    }
    const number = this.resolveNumber({ context, data, layout });

    if (!Number.isInteger(number)) {
      throw new LDataError({ context, kind: "not-integer" });
    }

    if (!Number.isSafeInteger(number)) {
      throw new LDataError({ context, kind: "not-safe-integer" });
    }

    return number;
  }

  protected resolveNull(
    { context, data, layout }: {
      data: unknown;
      context: LContext;
      layout: LNull;
    },
  ): null {
    if (data !== null) {
      throw new LDataError({ context, kind: "expected-null" });
    }
    return null;
  }

  protected resolveNumber(
    { context, data, layout }: {
      context: LContext;
      data: unknown;
      layout: LNumber;
    },
  ): number {
    if (data === null) {
      throw new LDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "number") {
      throw new LDataError({ context, kind: "expected-number" });
    }
    if (isNaN(data)) {
      throw new LDataError({ context, kind: "unexpected-not-a-number" });
    }
    if (!Number.isFinite(data)) {
      throw new LDataError({ context, kind: "unexpected-infinite" });
    }
    return data;
  }

  protected resolveObject(
    { context, data, layout }: {
      context: LContext;
      data: unknown;
      layout: LObject<unknown>;
    },
  ): object | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "object" || data === null) {
      throw new LDataError({ context, kind: "not-object" });
    }
    const result: Record<string, unknown> = {};
    const object = data as Record<string, unknown>;
    const requiredProperties = layout.required ?? {};
    for (const [propertyName, property] of Object.entries(layout.properties)) {
      const required = requiredProperties[propertyName] ?? true;
      const propertyLayout = property;
      const propertyValue = this.resolveObjectProperty({
        context,
        data: object[propertyName],
        propertyLayout,
        required,
      });
      result[propertyName] = propertyValue;
    }
    return result;
  }

  protected resolveObjectProperty(
    { context, data, propertyLayout, required }: {
      context: LContext;
      data: unknown;
      propertyLayout: LUnknown;
      required: boolean;
    },
  ): unknown {
    if (data === undefined) {
      if (required === false) {
        return undefined;
      }
      throw new LDataError({ context, kind: "missing-property" });
    }
    return this.#resolveAll({ context, data, layout: propertyLayout });
  }

  protected resolveString(
    { context, data, layout }: {
      data: unknown;
      context: LContext;
      layout: LString;
    },
  ): string | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "string") {
      throw new LDataError({ context, kind: "unexpected-type" });
    }
    return data;
  }
}
