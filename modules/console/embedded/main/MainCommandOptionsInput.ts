import { LayoutCommandOptions } from "../../layout/layoutOptions.ts";
import { helpCommandOptionLayout } from "../help/HelpCommandOptionsInput.ts";
import { quietCommandOptionLayout } from "../quiet/quietCommandOptionLayout.ts";

export interface MainCommandOptionsInput {
  help: boolean;
  quiet: boolean;
}

export const mainCommandOptionsInputLayout: LayoutCommandOptions<
  MainCommandOptionsInput
> = {
  properties: {
    help: helpCommandOptionLayout,
    quiet: quietCommandOptionLayout,
  },
  required: [],
  type: "object",
};
