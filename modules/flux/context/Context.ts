export type Context = Record<string, unknown>;

export type ServiceGetter<T extends unknown = unknown> = (
  serviceKey: string,
) => T;

export function createContext(
  { name }: {
    name: string;
  },
): Context {
  const context: Context = {};
  const get: ServiceGetter = (serviceKey) => {
    return context[serviceKey];
  };
  context["get"] = get;
  context[name] = context;
  return context;
}
