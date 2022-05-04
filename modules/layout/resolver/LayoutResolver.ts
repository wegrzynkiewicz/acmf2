import { LayoutDataError } from "../common/LayoutDataError.ts";
import { LayoutInvalidError } from "../common/LayoutInvalidError.ts";
import {
  Layout,
  LayoutBoolean,
  LayoutDescriptor,
  LayoutFloat,
  LayoutInteger,
  LayoutNull,
  LayoutNumber,
  LayoutObject,
  LayoutString,
} from "../layout.ts";

export interface LayoutArgs<T> {
  data: unknown;
  layout: LayoutDescriptor<T>;
}

export interface LayoutContext {
  errors: Error[];
  rootData: unknown;
}

export interface PositiveResult<T> {
  errors: LayoutDataError[],
  valid: true;
  sanitized: T;
}

export interface NegativeResult {
  errors: LayoutDataError[];
  valid: false;
}

export class LayoutError extends Error {
  public readonly errors: LayoutDataError[];
  public constructor(
    { context, errors, kind }: {
      context: LayoutContext;
      errors: LayoutDataError[];
      kind: string;
    },
  ) {
    super(kind);
    this.errors = errors;
    this.name = "LayoutError";
  }
}

export type LayoutResolverResult<T> = PositiveResult<T> | NegativeResult;

export interface LayoutResolverOptions {
  strictMode?: boolean;
}

export class LayoutResolver {
  readonly #strictMode;
  public constructor(options?: LayoutResolverOptions) {
    const opts = options ?? {};
    this.#strictMode = opts.strictMode ?? true;
  }

  public assert(args: LayoutArgs<unknown>): void {
    this.resolve(args);
  }

  public resolve<T>({ data, layout }: LayoutArgs<T>): T {
    const context: LayoutContext = {
      errors: [],
      rootData: data,
    };
    try {
      const value = this.#resolveLayout({ context, data, layout });
      return value as T;
    } catch (error: unknown) {
      if (error instanceof LayoutDataError) {
        throw new LayoutError({ errors: [error], context, kind: "test123" });
      }
      throw error;
    }
  }

  public validate<T>(args: LayoutArgs<T>): LayoutResolverResult<T> {
    try {
      const sanitized = this.resolve(args);
      return {
        errors: [],
        sanitized,
        valid: true,
      };
    } catch (error: unknown) {
      if (error instanceof LayoutError) {
        return {
          errors: error.errors,
          valid: false,
        };
      }
      throw error;
    }
  }

  #resolveLayout(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: Layout;
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
        throw new LayoutInvalidError({
          kind: "unexpected-type",
          context,
        });
    }
  }

  protected resolveBoolean(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutBoolean;
    },
  ): boolean | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (this.#strictMode === true) {
      if (typeof data !== "boolean") {
        throw new LayoutDataError({ context, kind: "unexpected-type" });
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
    throw new LayoutDataError({ context, kind: "unexpected-value" });
  }

  protected resolveFloat(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutFloat;
    },
  ): number | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    const number = this.resolveNumber({ context, data, layout });
    return number;
  }

  protected resolveInteger(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutInteger;
    },
  ): number | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    const number = this.resolveNumber({ context, data, layout });

    if (!Number.isInteger(number)) {
      throw new LayoutDataError({ context, kind: "not-integer" });
    }

    if (!Number.isSafeInteger(number)) {
      throw new LayoutDataError({ context, kind: "not-safe-integer" });
    }

    return number;
  }

  protected resolveNull(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutNull;
    },
  ): null {
    if (data !== null) {
      throw new LayoutDataError({ context, kind: "expected-null" });
    }
    return null;
  }

  protected resolveNumber(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutNumber;
    },
  ): number {
    if (data === null) {
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "number") {
      throw new LayoutDataError({ context, kind: "expected-number" });
    }
    if (isNaN(data)) {
      throw new LayoutDataError({ context, kind: "unexpected-not-a-number" });
    }
    if (!Number.isFinite(data)) {
      throw new LayoutDataError({ context, kind: "unexpected-infinite" });
    }
    return data;
  }

  protected resolveObject(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutObject<unknown>;
    },
  ): object | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "object" || data === null) {
      throw new LayoutDataError({ context, kind: "not-object" });
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
      context: LayoutContext;
      data: unknown;
      propertyLayout: Layout;
      required: boolean;
    },
  ): unknown {
    if (data === undefined) {
      if (required === false) {
        return undefined;
      }
      throw new LayoutDataError({ context, kind: "missing-property" });
    }
    return this.#resolveLayout({ context, data, layout: propertyLayout });
  }

  protected resolveString(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutString;
    },
  ): string | null {
    if (data === null) {
      if (layout.nullable === true) {
        return null;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "string") {
      throw new LayoutDataError({ context, kind: "unexpected-type" });
    }
    return data;
  }
}
