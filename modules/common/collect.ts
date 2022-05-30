export async function collect<TResult>(asyncIterator: AsyncIterableIterator<TResult>): Promise<TResult[]> {
  const list: TResult[] = [];
  for await (const item of asyncIterator) {
    list.push(item);
  }
  return list;
}
