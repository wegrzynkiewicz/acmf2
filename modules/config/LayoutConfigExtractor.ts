import { Layout, LayoutDescriptor, LayoutObject } from "../layout/layout.ts";
import { ConfigRegistry } from "./ConfigRegistry.ts";
import { ConfigResolver } from "./ConfigResolver.ts";

export class LayoutConfigExtractor {
  private readonly configRegistry: ConfigRegistry;
  private readonly configResolver: ConfigResolver;

  public constructor(
    { configRegistry, configResolver }: {
      configRegistry: ConfigRegistry;
      configResolver: ConfigResolver;
    },
  ) {
    this.configRegistry = configRegistry;
    this.configResolver = configResolver;
  }

  public async extractConfig<T>(layout: LayoutDescriptor<T>): Promise<T> {
    const config = await this.extractEntry(layout) as T;
    return config;
  }

  private async extractEntry(layout: Layout): Promise<unknown> {
    switch (layout.type) {
      case "array":
      case "boolean":
      case "dictionary":
      case "enumerable":
      case "float":
      case "integer":
      case "string":
        return this.extractBasicEntry(layout);
      case "object":
        return this.extractEntryFromObject(layout);
      default:
        throw new Error(
          `Cannot extract config entry from layout with type (${layout.type}).`,
        );
    }
  }

  private async extractBasicEntry(layout: Layout): Promise<unknown> {
    const metadata = layout.metadata ?? {};
    const key = metadata.configEntryKey;
    if (key === undefined) {
      throw new Error("Config layout missing metadata named (configEntryKey).");
    }
    if (typeof key !== "string" || key === "") {
      throw new Error(
        "Invalid config layout metadata property (configEntryKey).",
      );
    }
    this.configRegistry.registerEntry({ key, layout });
    const value = await this.configResolver.resolveEntry({ key, layout });
    return value;
  }

  private async extractEntryFromObject(
    layout: LayoutObject<unknown>,
  ): Promise<Record<string, unknown>> {
    const object: Record<string, unknown> = {};
    const properties = Object.entries(layout.properties);
    for (const [propertyName, propertyLayout] of properties) {
      const value = await this.extractEntry(propertyLayout);
      object[propertyName] = value;
    }
    return object;
  }
}
