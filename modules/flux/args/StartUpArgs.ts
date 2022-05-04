import { GlobalService } from "../context/global.ts";
import { provideDenoArgs } from "./provideDenoArgs.ts";

export type StartUpArgs = string[];

export async function provideStartUpArgs(): Promise<StartUpArgs> {
  const startUpArgs = provideDenoArgs();
  return startUpArgs;
}

export const startUpArgsService: GlobalService = {
  globalDeps: [],
  key: "startUpArgs",
  provider: provideStartUpArgs,
};
