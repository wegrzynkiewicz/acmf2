import { LayoutBooleanConsoleOption } from "../define/option.ts";

export const quietOptionLayout: LayoutBooleanConsoleOption = {
  defaults: false,
  description: "Do not output any message.",
  longFlags: ["quiet"],
  shortFlags: ["q"],
  type: "boolean",
};
