import { LayoutBoolean } from "../../../layout/layout.ts";

export const quietCommandOptionLayout: LayoutBoolean = {
  defaults: false,
  description: "Do not output any message.",
  metadata: {
    longFlags: ["quiet"],
    shortFlags: ["q"],
  },
  type: "boolean",
};
