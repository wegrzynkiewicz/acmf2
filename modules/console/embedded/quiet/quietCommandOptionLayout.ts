import { LayoutCommandBooleanOption } from "../../layout/layoutOptions.ts";

export const quietCommandOptionLayout: LayoutCommandBooleanOption = {
  default: false,
  description: "Do not output any message.",
  type: "boolean",
  longFlags: ["quiet"],
  shortFlags: ["q"],
};
