import { ConfigParticle } from "../config/ConfigParticle.ts";
import { ConsoleParticle } from "../console/ConsoleParticle.ts";
import { bootstrap } from "../flux/bootstrap.ts";
import { DebuggerParticle } from "../debugger/DebuggerParticle.ts";
import { FluxParticle } from "../flux/FluxParticle.ts";
import { UsefulParticle } from "../useful/UsefulParticle.ts";
import { LogParticle } from "../log/LogParticle.ts";
import { VersionParticle } from "../version/VersionParticle.ts";

bootstrap({
  particles: [
    new ConfigParticle(),
    new ConsoleParticle(),
    new DebuggerParticle(),
    new FluxParticle(),
    new LogParticle(),
    new UsefulParticle(),
    new VersionParticle(),
  ],
});
