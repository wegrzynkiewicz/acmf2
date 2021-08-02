import { LayoutObject } from "../../../layout/layout.ts";

export interface NullCommandArgumentsInput {}

export const nullCommandArgumentsInputLayout: LayoutObject<
  NullCommandArgumentsInput
> = {
  properties: {},
  type: "object",
};
