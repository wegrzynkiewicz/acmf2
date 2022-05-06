import { consoleExecutorParticle } from "../console/consoleParticle.ts";
import { bootstrap } from "../flux/bootstrap.ts";
import { fluxParticle } from "../flux/fluxParticle.ts";

bootstrap({
  particles: [
    consoleExecutorParticle,
    fluxParticle,
  ],
});
