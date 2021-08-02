export function getPrototypeName(object: unknown): string {
  if (typeof object === "object" && object !== null) {
    const prototype = Object.getPrototypeOf(object) as {
      ["constructor"]: { name: string };
    };
    return prototype.constructor.name;
  }
  return "";
}
