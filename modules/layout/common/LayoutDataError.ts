import { LayoutContext } from "./LayoutContext.ts";

export class LayoutDataError extends Error {
  public constructor(
    { context, kind }: {
      context: LayoutContext;
      kind: string;
    },
  ) {
    super(kind);
    this.name = "LayoutDataError";
  }
}
