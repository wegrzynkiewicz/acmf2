import { LayoutObject } from "../../../layout/layout.ts";

export interface HelpCommandArgumentsInput {
  command: string;
}

export const helpCommandArgumentsInputLayout: LayoutObject<
  HelpCommandArgumentsInput
> = {
  properties: {
    command: {
      defaults: "",
      description: "The command whose help information will displayed.",
      type: "string",
    },
  },
  required: {
    command: false,
  },
  type: "object",
};
