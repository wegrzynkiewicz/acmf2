type MaxLengths<T> = { [P in keyof T]: number };

export class Table<T> {
  private readonly headers: T;
  private readonly orders: (keyof T)[];
  private readonly rows: T[] = [];
  private readonly showHeaders: boolean;

  public constructor(
    { headers, orders, showHeaders }: {
      headers: T;
      orders: (keyof T)[];
      showHeaders: boolean;
    },
  ) {
    this.headers = headers;
    this.orders = orders;
    this.showHeaders = showHeaders;
  }

  public addRows(rows: T[]) {
    for (const row of rows) {
      this.addRow(row);
    }
  }

  public addRow(row: T) {
    this.rows.push(row);
  }

  public getEmptyMaxLengths(): MaxLengths<T> {
    const keys = Object.keys(this.headers);
    const accumulator: Record<string, unknown> = {};
    for (const key of keys) {
      accumulator[key] = 0;
    }
    const maxLengths = accumulator as MaxLengths<T>;
    return maxLengths;
  }

  public calculateMaxWidth(): MaxLengths<T> {
    const maxLengths = this.getEmptyMaxLengths();
    for (const row of this.getRows()) {
      const entries = Object.entries(row) as unknown as [keyof T, string][];
      for (const [key, value] of entries) {
        if (value.length > maxLengths[key]) {
          maxLengths[key] = value.length;
        }
      }
    }
    return maxLengths;
  }

  public getRows(): T[] {
    const rows = [...this.rows];
    if (this.showHeaders) {
      rows.unshift(this.headers);
    }
    return rows;
  }

  public getTableAsString(): string {
    let buffer = "";
    const maxLengths = this.calculateMaxWidth();
    for (const row of this.getRows()) {
      for (const key of this.orders) {
        const value = row[key] as unknown as string;
        const maxLength = maxLengths[key];
        buffer += value.padEnd(maxLength + 3, " ");
      }
      buffer += "\n";
    }
    return buffer;
  }
}
