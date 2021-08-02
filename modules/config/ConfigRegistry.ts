import { debug } from "../debugger/debug.ts";
import { Layout } from "../layout/layout.ts";

export class ConfigRegistry {
  public readonly entries = new Map<string, Layout>();

  public registerEntry(
    { key, layout }: {
      key: string;
      layout: Layout;
    },
  ): void {
    if (this.entries.has(key)) {
      throw new Error(`Configuration entry named (${key}) already exists.`);
    }
    debug({
      channel: "CONFIG",
      kind: "config-entry-registering",
      message: `Registering config key (${key}).`,
    });
    this.entries.set(key, layout);
  }
}
