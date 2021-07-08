import { ConsoleOption } from "../define/ConsoleOption.ts";

export class QuietOption extends ConsoleOption {
  public constructor() {
    super({
      description: "Do not output any message.",
      longFlags: ["quiet"],
      name: "quiet",
      shortFlags: ["q"],
    });
  }
}
