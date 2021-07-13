import {
  LayoutCommandBooleanOption,
  LayoutCommandOptions,
} from "../../layout/layoutOptions.ts";

export interface HelpCommandOptionsInput {
  help: boolean;
}

export const helpCommandOptionLayout: LayoutCommandBooleanOption = {
  default: false,
  description: "Show the help information about this command.",
  type: "boolean",
  longFlags: ["help"],
  shortFlags: ["h"],
};

export const helpCommandOptionsInputLayout: LayoutCommandOptions<
  HelpCommandOptionsInput
> = {
  properties: {
    help: helpCommandOptionLayout,
  },
  required: [],
  type: "object",
};
