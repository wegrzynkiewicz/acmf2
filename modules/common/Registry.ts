export interface Entry {
  key: string | symbol;
}

export class Registry<TEntry extends Entry> {
  public readonly entities = new Map<string | symbol, TEntry>();

  public register(variable: TEntry): void {
    const { key } = variable;
    if (this.entities.has(key)) {
      throw new Error(`Entry with key (${key.toString()}) already exists.`);
    }
    this.entities.set(key, variable);
  }
}
