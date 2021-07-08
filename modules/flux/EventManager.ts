interface FluxEvents {
  exit: () => void;
}

export class EventManager {
  public constructor() {
  }

  public async once<K extends keyof FluxEvents>(
    eventName: K,
    listener: FluxEvents[K],
  ): Promise<void> {
  }

  public async emit<K extends keyof FluxEvents>(
    eventName: K,
    ...args: Parameters<FluxEvents[K]>
  ): Promise<void> {
  }
}
