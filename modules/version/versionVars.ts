import { EnvironmentVariable } from "../flux/env/EnvironmentVariable.ts";

export const revisionVariable: EnvironmentVariable = {
  key: "revision",
  layout: {
    defaults: "0000000",
    description: "Provides an up-to-date revision number of the app.",
    type: "string",
  },
  variable: "REVISION",
};

export const versionVariable: EnvironmentVariable = {
  key: "version",
  layout: {
    defaults: "0.0.0",
    description: "Provides an up-to-date semver compatible version of the app.",
    type: "string",
  },
  variable: "VERSION",
};
