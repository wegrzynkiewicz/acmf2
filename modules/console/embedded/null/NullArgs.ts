import { LayoutConsoleArguments } from "../../define/ConsoleArgument.ts";

export interface NullArgs {}

export const nullArgsLayout: LayoutConsoleArguments<NullArgs> = {
  properties: {},
  type: "object",
};
