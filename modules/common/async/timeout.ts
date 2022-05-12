export function timeout(milliseconds: number, reason?: unknown): Promise<void> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(reason), milliseconds);
  });
}
  