import { ConfigGetter } from "../config/ConfigGetter.ts";
import { ConfigVariable } from "../config/ConfigVariable.ts";
import { GlobalService } from "../flux/context/GlobalService.ts";

export interface VersionConfig {
  revision: string;
  version: string;
}

export const appRevisionVariable: ConfigVariable = {
  key: "REVISION",
  layout: {
    defaults: "0000000",
    description: "Provides an up-to-date revision number of the app.",
    type: "string",
  },
};

export const appVersionVariable: ConfigVariable = {
  key: "VERSION",
  layout: {
    defaults: "0.0.0",
    description: "Provides an up-to-date semver compatible version of the app.",
    type: "string",
  },
};

export async function provideVersionConfig(
  { configGetter }: {
    configGetter: ConfigGetter;
  },
): Promise<VersionConfig> {
  const versionConfig: VersionConfig = {
    revision: configGetter.get(appRevisionVariable.key),
    version: configGetter.get(appVersionVariable.key),
  };
  return versionConfig;
}

export const versionConfigService: GlobalService = {
  globalDeps: ["configGetter"],
  key: "versionConfig",
  provider: provideVersionConfig,
};
