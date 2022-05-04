// deno-lint-ignore no-explicit-any
export type ScopedContext = any;
export type ScopedKey = string | symbol;

export function createScopedContext(): ScopedContext {
  const context: ScopedContext = {};
  context.scopedContext = context;
  context.get = (serviceKey: ScopedKey) => {
    return context[serviceKey];
  };
  return context;
}
