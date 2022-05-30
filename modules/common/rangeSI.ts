export function* rangeSI(from: number, to: number): Generator<number, void, void> {
  const order = from < to ? 1 : -1;
  let i = from;
  while (i !== to) {
    yield i;
    i += order;
  }
  yield i;
}
