// deno-lint-ignore no-explicit-any
export type GlobalContext = any;
export type GlobalKey = string | symbol;

export interface GlobalService {
  globalDeps: GlobalKey[];
  key: string;
  provider: (globalContext: GlobalContext) => Promise<unknown>;
}

export function createGlobalContext(): GlobalContext {
  const context: GlobalContext = {};
  context.globalContext = context;
  context.get = (serviceKey: GlobalKey) => {
    return context[serviceKey];
  };
  return context;
}
