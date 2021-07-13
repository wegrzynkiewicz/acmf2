import { LayoutCommandArguments } from "../../layout/layoutArguments.ts";

export interface NullCommandArgumentsInput {}

export const nullCommandArgumentsInputLayout: LayoutCommandArguments<
  NullCommandArgumentsInput
> = {
  order: [],
  properties: {},
  required: [],
  type: "object",
};
