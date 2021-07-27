import { LayoutContext } from "../common/LayoutContext.ts";
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

export class LayoutValidator {
  public assert(
    { data, layout }: {
      data: unknown;
      layout: Layout;
    },
  ): void {
    const context = new LayoutContext();
    return this.assertLayout({ context, data, layout });
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
      const context = new LayoutContext();
      this.assertLayout({ context, data, layout });
    } catch (error: unknown) {
      valid = false;
      if (error instanceof Error) {
        errors.push(error);
      }
    }
    return { errors, valid };
  }

  protected assertLayout(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: Layout;
    },
  ): void {
    switch (layout.type) {
      case "any":
        // nothing
        break;
      case "array":
        break;
      case "boolean":
        this.assertBoolean({ context, data, layout });
        break;
      case "dictionary":
        break;
      case "float":
        this.assertFloat({ context, data, layout });
        break;
      case "integer":
        this.assertInteger({ context, data, layout });
        break;
      case "null":
        this.assertNull({ context, data, layout });
        break;
      case "object":
        this.assertObject({ context, data, layout });
        break;
      case "reference":
        break;
      case "string":
        this.assertString({ context, data, layout });
        break;
      default:
        throw new LayoutInvalidError({
          kind: "unexpected-type",
          context,
        });
    }
  }

  protected assertBoolean(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutBoolean;
    },
  ): void {
    if (data === null) {
      if (layout.nullable === true) {
        return;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "boolean") {
      throw new LayoutDataError({ context, kind: "unexpected-type" });
    }
  }

  protected assertFloat(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutFloat;
    },
  ): void {
    if (data === null) {
      if (layout.nullable === true) {
        return;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    this.assertNumber({ context, data, layout });
  }

  protected assertInteger(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutInteger;
    },
  ): void {
    if (data === null) {
      if (layout.nullable === true) {
        return;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    this.assertNumber({ context, data, layout });

    if (!Number.isInteger(data)) {
      throw new LayoutDataError({ context, kind: "not-integer" });
    }

    if (!Number.isSafeInteger(data)) {
      throw new LayoutDataError({ context, kind: "not-safe-integer" });
    }
  }

  protected assertNull(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutNull;
    },
  ): void {
    if (data !== null) {
      throw new LayoutDataError({ context, kind: "not-null" });
    }
  }

  protected assertNumber(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutNumber;
    },
  ): void {
    if (typeof data !== "number") {
      throw new LayoutDataError({ context, kind: "expected-number" });
    }
    if (isNaN(data)) {
      throw new LayoutDataError({ context, kind: "unexpected-not-a-number" });
    }
    if (!Number.isFinite(data)) {
      throw new LayoutDataError({ context, kind: "unexpected-infinite" });
    }
  }

  protected assertObject(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutObject<unknown>;
    },
  ): void {
    if (data === null) {
      if (layout.nullable === true) {
        return;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "object" || data === null) {
      throw new LayoutDataError({ context, kind: "not-object" });
    }
    const object = data as Record<string, unknown>;

    for (const [propertyName, property] of Object.entries(layout.properties)) {
      const propertyValue = object[propertyName];
      const propertyLayout = property as LayoutObjectProperty<unknown>;
      const propertyContext = new LayoutContext();

      this.assertObjectProperty({
        context: propertyContext,
        data: propertyValue,
        layout: propertyLayout,
      });
    }
  }

  protected assertObjectProperty(
    { context, data, layout }: {
      context: LayoutContext;
      data: unknown;
      layout: LayoutObjectProperty<unknown>;
    },
  ): void {
    if (data === undefined) {
      if (layout.required === false) {
        return;
      }
      throw new LayoutDataError({ context, kind: "missing-property" });
    }
    const fieldLayout = layout.field as Layout;
    this.assertLayout({
      context,
      data,
      layout: fieldLayout,
    });
  }

  protected assertString(
    { context, data, layout }: {
      data: unknown;
      context: LayoutContext;
      layout: LayoutString;
    },
  ): void {
    if (data === null) {
      if (layout.nullable === true) {
        return;
      }
      throw new LayoutDataError({ context, kind: "unexpected-null" });
    }
    if (typeof data !== "string") {
      throw new LayoutDataError({ context, kind: "unexpected-type" });
    }
  }
}
