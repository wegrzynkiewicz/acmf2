import { Layout } from "./layout.ts";

export class LayoutRegistry {
  private readonly layouts = new Map<string, Layout>();

  public registerLayout(layout: Layout): void {
    const { id } = layout;
    if (id === undefined) {
      throw new Error("Cannot registering layout without id.");
    }
    if (id === "") {
      throw new Error("Cannot registering layout with empty id.");
    }
    if (this.layouts.has(id)) {
      throw new Error(`Layout with id (${id}) already exists.`);
    }
    this.layouts.set(id, layout);
  }
}
