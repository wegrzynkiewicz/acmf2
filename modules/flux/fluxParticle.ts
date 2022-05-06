import { consoleParticle } from "../console/consoleParticle.ts";
import { dateParticle } from "../date/dateParticle.ts";
import { logParticle } from "../log/logParticle.ts";
import { startUpArgsService } from "./args/StartUpArgs.ts";
import { Particle } from "./particles/Particle.ts";
import { standardStreamsService } from "./streams/StandardStreams.ts";

export const fluxParticle: Particle = {
  globalServices: [
    standardStreamsService,
    startUpArgsService,
  ],
  key: "flux",
  particles: [
    consoleParticle,
    dateParticle,
    logParticle,
  ],
};
