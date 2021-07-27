import { Layout, LayoutPrimitive } from "../layout.ts";

export function isPrimitiveLayout(layout: Layout): layout is LayoutPrimitive {
  switch (layout.type) {
    case "boolean":
    case "float":
    case "integer":
    case "string":
      return true;
    default:
      return false;
  }
}
