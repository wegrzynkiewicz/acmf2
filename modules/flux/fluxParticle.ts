import { startUpArgsService } from "./args/StartUpArgs.ts";
import { Particle } from "./particles/Particle.ts";
import { standardStreamsService } from "./streams/StandardStreams.ts";

export const fluxParticle: Particle = {
  globalServices: [
    standardStreamsService,
    startUpArgsService,
  ],
  key: "flux",
};
