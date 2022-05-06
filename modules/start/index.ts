import { bootstrap } from "../flux/bootstrap.ts";
import { fluxParticle } from "../flux/fluxParticle.ts";
import { logParticle } from "../log/logParticle.ts";

bootstrap({
  particles: [
    // debugParticle,
    // configParticle,
    // consoleParticle,
    // dateParticle,
    fluxParticle,
    logParticle,
    // versionParticle,
  ],
});
