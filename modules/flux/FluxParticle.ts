import { ServiceRegistry } from "../flux/context/ServiceRegistry.ts";
import { DenoArgsProvider } from "./args/DenoArgsProvider.ts";
import { ExitCodeManager } from "./ExitCodeManager.ts";
import { Particle } from "./particles/Particle.ts";
import { DenoSTDStreamsProvider } from "./streams/DenoSTDStreamsProvider.ts";

export class FluxParticle implements Particle {
  public async bootstrap(
    { serviceRegistry }: {
      serviceRegistry: ServiceRegistry;
    },
  ): Promise<void> {
    const exitCodeManager = new ExitCodeManager();

    const denoArgsProvider = new DenoArgsProvider();
    const startUpArgs = denoArgsProvider.provide();

    const denoSTDStreamsProvider = new DenoSTDStreamsProvider();
    const standardStreams = denoSTDStreamsProvider.provide();

    serviceRegistry.registerServices({
      denoArgsProvider,
      exitCodeManager,
      standardStreams,
      startUpArgs,
    });
  }
}
