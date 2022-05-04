export interface Entry {
  key: string | symbol;
}

export class Registry<TEntry extends Entry> {
  public readonly entries = new Map<string | symbol, TEntry>();

  public register(variable: TEntry): void {
    const { key } = variable;
    if (this.entries.has(key)) {
      throw new Error(`Configuration variable named (${key.toString}) already exists.`);
    }
    this.entries.set(key, variable);
  }
}
