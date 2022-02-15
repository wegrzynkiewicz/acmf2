import { LayoutConsoleArguments } from "../../define/ConsoleArgument.ts";

export type NullArgs = Record<never, never>;

export const nullArgsLayout: LayoutConsoleArguments<NullArgs> = {
  properties: {},
  type: "object",
};
