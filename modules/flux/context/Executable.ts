import { Context } from "./Context.ts";

export interface ExecutableFunction {
  (
    globalContext: Context,
    localContext?: Context,
    options?: Context,
  ): Promise<unknown>;
}

export interface ExecutableHandler {
  execute: ExecutableFunction;
}
