import { LayoutConsoleArguments } from "../define/argument.ts";

export type NullArgs = Record<never, never>;

export const nullArgsLayout: LayoutConsoleArguments<NullArgs> = {
  properties: {},
  type: "object",
};
