import { LayoutObject } from "../../../layout/layout.ts";
import { helpCommandOptionLayout } from "../help/HelpCommandOptionsInput.ts";
import { quietCommandOptionLayout } from "../quiet/quietCommandOptionLayout.ts";

export interface MainCommandOptionsInput {
  help: boolean;
  quiet: boolean;
}

export const mainCommandOptionsInputLayout: LayoutObject<
  MainCommandOptionsInput
> = {
  properties: {
    help: helpCommandOptionLayout,
    quiet: quietCommandOptionLayout,
  },
  type: "object",
};
