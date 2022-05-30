export function timeout(
  { milliseconds, reason, signal }: {
    milliseconds: number;
    reason?: unknown;
    signal?: AbortSignal;
  },
): Promise<void> {
  return new Promise((_, reject) => {
    const id = setTimeout(() => reject(reason), milliseconds);
    if (signal !== undefined) {
      const eventListener = () => {
        clearTimeout(id);
        signal.removeEventListener("abort", eventListener);
      };
      signal.addEventListener("abort", eventListener);
    }
  });
}
