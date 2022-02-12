import { GlobalContext, Key } from "./Context.ts";

export interface GlobalService {
  globalDeps: Key[];
  key: string;
  provider: (globalContext: GlobalContext) => Promise<unknown>;
}
