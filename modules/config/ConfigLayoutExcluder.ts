import { debug } from "../debugger/debug.ts";
import { Layout, LayoutObject } from "../layout/layout.ts";
import { ConfigEntry } from "./ConfigEntry.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";

export class ConfigLayoutExcluder {
  private readonly configRegistry: ConfigRegistry;

  public constructor(
    { configRegistry }: {
      configRegistry: ConfigRegistry;
    },
  ) {
    this.configRegistry = configRegistry;
  }

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

  private excludeEntry(layout: Layout): void {
  }

  private excludeEntryFromObject(layout: LayoutObject<unknown>): void {
  }
}
