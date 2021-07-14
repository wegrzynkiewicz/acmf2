interface FluxEvents {
  exit: () => Promise<void>;
}

type Mapper = {
  [K in keyof FluxEvents]: Set<FluxEvents[K]>;
}

export class EventManager {

  protected readonly map: Mapper = {
    exit: new Set(),
  };

  public async once<K extends keyof FluxEvents>(
    eventName: K,
    listener: FluxEvents[K],
  ): Promise<void> {
    // @ts-ignore
    this.map[eventName].add(listener);
  }

  public async emit<K extends keyof FluxEvents>(
    eventName: K,
    ...args: Parameters<FluxEvents[K]>
  ): Promise<void> {
    const list = [...this.map[eventName].values()];
    const promises = list.map(async (listener) => {
      listener.apply(args);
    })
    await Promise.all(promises);
  }
}
