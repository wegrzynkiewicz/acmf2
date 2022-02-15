export type Key = string | symbol;
// deno-lint-ignore no-explicit-any
export type Context = any;
export type GlobalContext = Context;
export type ScopedContext = Context;

export function createGlobalContext(): GlobalContext {
  const context: GlobalContext = {};
  context.globalContext = context;
  context.get = (serviceKey: Key) => {
    return context[serviceKey];
  };
  return context;
}

export function createScopedContext(): ScopedContext {
  const context: ScopedContext = {};
  context.scopedContext = context;
  context.get = (serviceKey: Key) => {
    return context[serviceKey];
  };
  return context;
}
