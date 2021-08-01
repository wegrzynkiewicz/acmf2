import { debug } from "../debugger/debug.ts";
import { Layout, LayoutObject } from "../layout/layout.ts";

export class ConfigRegistry {
  public readonly layouts = new Map<string, LayoutObject<unknown>>();
  public readonly entries = new Map<string, Layout>();

  public registerConfigFromLayouts(
    layouts: Record<string, LayoutObject<unknown>>,
  ): void {
    for (const [name, layout] of Object.entries(layouts)) {
      this.excludeEntry(layout);
      this.layouts.set(name, layout);
    }
  }

  private excludeEntry(layout: Layout) {
    switch (layout.type) {
      case "array":
      case "boolean":
      case "dictionary":
      case "enumerable":
      case "float":
      case "integer":
      case "string":
        this.excludeBasicEntry(layout);
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

  private excludeBasicEntry(layout: Layout): void {
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
      this.excludeBasicEntry(layout);
    } catch (error: unknown) {
      // nothing
    }
    for (const propertyLayout of Object.values(layout.properties)) {
      try {
        this.excludeEntry(propertyLayout);
      } catch (error: unknown) {
        // nothing
      }
    }
  }
}
