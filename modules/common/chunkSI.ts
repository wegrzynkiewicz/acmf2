export function* chunkSI<T>(iterable: Iterator<T>, size: number): Generator<T[], void, void> {
  let list: T[] = [];
  while (true) {
    const { value, done } = iterable.next();
    if (done === true) {
      break;
    }
    list.push(value);
    if (list.length === size) {
      yield list;
      list = [];
    }
  }
  if (list.length > 0) {
    yield list;
  }
}
