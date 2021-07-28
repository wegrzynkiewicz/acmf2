import { CurrentDateProvider } from "../useful/CurrentDateProvider.ts";
import { VersionConfig } from "./VersionConfig.ts";
import { VersionInfo } from "./VersionInfo.ts";

export class VersionProvider {
  private readonly currentDateProvider: CurrentDateProvider;
  private readonly versionConfig: VersionConfig;

  public constructor(
    { currentDateProvider, versionConfig }: {
      currentDateProvider: CurrentDateProvider;
      versionConfig: VersionConfig;
    },
  ) {
    this.currentDateProvider = currentDateProvider;
    this.versionConfig = versionConfig;
  }

  public provideVersionInfo(): VersionInfo {
    const currentDate = this.currentDateProvider.provideCurrentDate();
    const { revision, version } = this.versionConfig;
    const consoleVersion: VersionInfo = {
      copyright: currentDate.getUTCFullYear().toString(),
      intro: "acmf2",
      revision,
      version,
    };
    return consoleVersion;
  }
}
