import { debug } from "../debugger/debug.ts";
import { ConfigEntry } from "./ConfigEntry.ts";

export class ConfigRegistry {
  public readonly entries = new Map<string, ConfigEntry>();

  public registerEntry(entry: ConfigEntry): void {
    const { key } = entry;
    if (this.entries.has(key)) {
      throw new Error(`Configuration entry named (${key}) already exists.`);
    }
    debug({
      kind: "config-entry-registering",
      message: `Registering config key (${key}).`,
    });
    this.entries.set(key, entry);
  }
}
