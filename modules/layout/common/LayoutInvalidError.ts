import { LayoutContext } from "./LayoutContext.ts";

export class LayoutInvalidError extends Error {
  public constructor(
    { context, kind }: {
      context: LayoutContext;
      kind: string;
    },
  ) {
    super(kind);
    this.name = "LayoutInvalidError";
  }
}
