import { Layout } from "../layout/layout.ts";

export interface ConfigEntry {
  defaults?: string;
  key: string;
  layout: Layout;
}
