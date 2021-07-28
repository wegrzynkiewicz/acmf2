import { debug } from "../debugger/debug.ts";
import { Layout, LayoutObject, LayoutRecord } from "../layout/layout.ts";

export class ConfigRegistry {
  public readonly entries = new Map<string, Layout>();

  public registerEntriesFromLayout(layout: Layout): void {
    switch (layout.type) {
      case "array":
      case "boolean":
      case "dictionary":
      case "enumerable":
      case "float":
      case "integer":
      case "string":
        this.excludeEntry(layout);
        break;
      case "object":
        this.excludeEntryFromObject(layout);
        break;
      default:
        throw new Error(
          `Cannot exclude config entry from layout with type (${layout.type}).`,
        );
    }
  }

  private registerEntry(
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

  private excludeEntry(layout: Layout): void {
    const metadata = layout.metadata ?? {};
    const key = metadata.configEntryKey;
    if (key === undefined) {
      throw new Error("Config layout missing metadata named (configEntryKey).");
    }
    if (typeof key !== "string") {
      return;
    }
    this.registerEntry({ key, layout });
  }

  private excludeEntryFromObject(layout: LayoutObject<unknown>): void {
    try {
      this.excludeEntry(layout);
    } catch (error: unknown) {
      // nothing
    }
    for (const propertyLayout of Object.values(layout.properties)) {
      try {
        this.registerEntriesFromLayout(propertyLayout);
      } catch (error: unknown) {
        // nothing
      }
    }
  }
}
