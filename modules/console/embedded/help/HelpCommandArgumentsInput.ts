import { LayoutCommandArguments } from "../../layout/layoutArguments.ts";

export interface HelpCommandArgumentsInput {
  command: string;
}

export const helpCommandArgumentsInputLayout: LayoutCommandArguments<
  HelpCommandArgumentsInput
> = {
  order: ["command"],
  properties: {
    command: {
      default: "help",
      description: "The command whose help information will displayed.",
      type: "string",
    },
  },
  required: [],
  type: "object",
};
