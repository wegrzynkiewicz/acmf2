import { LayoutDataError } from "../common/LayoutDataError.ts";
import { LayoutInvalidError } from "../common/LayoutInvalidError.ts";
import { LayoutValidatorResult } from "../common/LayoutValidatorResult.ts";
import {
  Layout,
  LayoutBoolean,
  LayoutFloat,
  LayoutInteger,
  LayoutNull,
  LayoutNumber,
  LayoutObject,
  LayoutString,
} from "../layout.ts";

export class LayoutContext {
}

export class LayoutResolver {
  public assert(
    { data, layout }: {
      data: unknown;
      layout: Layout;
    },
  ): void {
    this.resolve({ data, layout });
  }

  public validate(
    { data, layout }: {
      data: unknown;
      layout: Layout;
    },
  ): LayoutValidatorResult {
    let errors: Error[] = [];
    let valid: boolean = true;
    try {
      this.resolve({ data, layout });
    } catch (error: unknown) {
      valid = false;
      if (error instanceof Error) {
        errors.push(error);
      }
    }
    return { errors, valid };
  }

  public resolve<T>(
    { data, layout }: {
      data: unknown;
      layout: Layout;
    },
  ): T {
    const context = new LayoutContext();
    const value = this.resolveLayout({ context, data, layout });
    return value as T;
  }

  protected resolveLayout(
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
    if (typeof data !== "boolean") {
      throw new LayoutDataError({ context, kind: "unexpected-type" });
    }
    return data;
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
    return this.resolveLayout({ context, data, layout: propertyLayout });
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
