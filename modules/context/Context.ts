export type Context = Record<string, unknown>;

export function createContext(
  { name }: {
    name: string;
  },
): Context {
  const context: Context = {};
  const get = <T>(serviceKey: string): T => {
    return context[serviceKey] as T;
  };
  context["get"] = get;
  context[name] = context;
  return context;
}
