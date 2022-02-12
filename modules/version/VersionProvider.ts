import { CurrentDateProvider } from "../date/CurrentDateProvider.ts";
import { GlobalService } from "../flux/context/GlobalService.ts";
import { VersionConfig } from "./VersionConfig.ts";

export interface VersionInfo {
  copyright: string;
  intro: string;
  revision: string;
  version: string;
}

export type VersionProvider = () => VersionInfo;

export async function provideVersionProvider(
  { currentDateProvider, versionConfig }: {
    currentDateProvider: CurrentDateProvider;
    versionConfig: VersionConfig;
  },
): Promise<VersionProvider> {
  return (): VersionInfo => {
    const currentDate = currentDateProvider.provideCurrentDate();
    const { revision, version } = versionConfig;
    const consoleVersion: VersionInfo = {
      copyright: currentDate.getUTCFullYear().toString(),
      intro: "acmf2",
      revision,
      version,
    };
    return consoleVersion;
  };
}

export const versionProviderService: GlobalService = {
  globalDeps: ["currentDateProvider", "versionConfig"],
  key: "versionProvider",
  provider: provideVersionProvider,
};
