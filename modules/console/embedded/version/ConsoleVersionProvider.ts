import { Config } from "../../../config/Config.ts";

export interface ConsoleVersion {
  copyright: string;
  intro: string;
  revision: string;
  version: string;
}

export class ConsoleVersionProvider {
  private readonly config: Config;

  public constructor({ config }: { config: Config }) {
    this.config = config;
  }

  public provide(): ConsoleVersion {
    const consoleVersion: ConsoleVersion = {
      copyright: new Date().getFullYear().toString(),
      intro: "console",
      revision: this.config.get("APP_REVISION"),
      version: this.config.get("APP_VERSION"),
    };
    return consoleVersion;
  }
}
