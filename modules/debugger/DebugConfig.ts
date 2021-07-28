import { LayoutObject } from "../layout/layout.ts";

export interface DebugConfig {
  enabled: boolean;
}

export const debugConfigLayout: LayoutObject<DebugConfig> = {
  properties: {
    enabled: {
      defaults: false,
      description: "Enabling the built-in debugger logger.",
      metadata: {
        configEntryKey: "APP_DEBUGGER_ENABLED",
        serialization: {
          type: "binaryChar",
        },
      },
      type: "boolean",
    },
  },
  type: "object",
};
