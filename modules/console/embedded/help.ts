import { LayoutConsoleArguments } from "../define/argument.ts";
import { LayoutBooleanConsoleOption, LayoutConsoleOptions } from "../define/option.ts";

export interface HelpArgs {
  command: string;
}

export const helpArgsLayout: LayoutConsoleArguments<HelpArgs> = {
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

export const helpOptionLayout: LayoutBooleanConsoleOption = {
  defaults: false,
  description: "Show the help information about this command.",
  longFlags: ["help"],
  shortFlags: ["h"],
  type: "boolean",
};

export interface HelpOptions {
  help: boolean;
}

export const helpOptionsLayout: LayoutConsoleOptions<HelpOptions> = {
  properties: {
    help: helpOptionLayout,
  },
  type: "object",
};
