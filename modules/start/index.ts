import { configParticle } from "../config/configParticle.ts";
import { bootstrap } from "../flux/bootstrap.ts";
import { logParticle } from "../log/LogParticle.ts";
import { fluxParticle } from "../flux/fluxParticle.ts";
import { dateParticle } from "../date/dateParticle.ts";
import { versionParticle } from "../version/versionParticle.ts";
import { consoleParticle } from "../console/ConsoleParticle.ts";
import { debugParticle } from "../debugger/debugParticle.ts";

bootstrap({
  particles: [
    debugParticle,
    configParticle,
    consoleParticle,
    dateParticle,
    fluxParticle,
    logParticle,
    versionParticle,
  ],
});
