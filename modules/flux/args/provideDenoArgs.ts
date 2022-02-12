import { StartUpArgs } from "./StartUpArgs.ts";

export function provideDenoArgs(): StartUpArgs {
  return [...Deno.args];
}
