import { ConsoleOption } from "../define/ConsoleOption.ts";

export class HelpOption extends ConsoleOption {
  public constructor() {
    super({
      description: "Show the help information about this command.",
      longFlags: ["help"],
      name: "help",
      shortFlags: ["h"],
    });
  }
}
