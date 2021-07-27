import { LayoutBoolean, LayoutObject } from "../../../layout/layout.ts";

export interface HelpCommandOptionsInput {
  help: boolean;
}

export const helpCommandOptionLayout: LayoutBoolean = {
  defaults: false,
  description: "Show the help information about this command.",
  metadata: {
    longFlags: ["help"],
    shortFlags: ["h"],
  },
  type: "boolean",
};

export const helpCommandOptionsInputLayout: LayoutObject<
  HelpCommandOptionsInput
> = {
  properties: {
    help: helpCommandOptionLayout,
  },
  type: "object",
};
