import { LayoutObject } from "../layout/layout.ts";

export interface VersionConfig {
  revision: string;
  version: string;
}

export const versionConfigLayout: LayoutObject<VersionConfig> = {
  properties: {
    revision: {
      defaults: "0000000",
      description: "Provides an up-to-date revision number of the app.",
      metadata: {
        configEntryKey: "APP_REVISION",
      },
      type: "string",
    },
    version: {
      defaults: "0.0.0",
      description:
        "Provides an up-to-date semver compatible version of the app.",
      metadata: {
        configEntryKey: "APP_VERSION",
      },
      type: "string",
    },
  },
  type: "object",
};
