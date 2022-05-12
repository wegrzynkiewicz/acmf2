import { CurrentDateProvider } from "../date/CurrentDateProvider.ts";
import { GlobalService } from "../flux/context/global.ts";

export interface VersionInfo {
  copyright: string;
  intro: string;
  revision: string;
  version: string;
}

export interface VersionProvider {
  provideVersionInfo: () => VersionInfo;
}

export async function provideVersionProvider(
  { currentDateProvider, revision, version }: {
    currentDateProvider: CurrentDateProvider;
    revision: string;
    version: string;
  },
): Promise<VersionProvider> {
  const provideVersionInfo = (): VersionInfo => {
    const currentDate = currentDateProvider.provideCurrentDate();
    const consoleVersion: VersionInfo = {
      copyright: currentDate.getUTCFullYear().toString(),
      intro: "acmf2",
      revision,
      version,
    };
    return consoleVersion;
  };
  return { provideVersionInfo };
}

export const versionProviderService: GlobalService = {
  globalDeps: ["currentDateProvider", "versionConfig"],
  key: "versionProvider",
  provider: provideVersionProvider,
};
