import { Particle } from "../flux/particles/Particle.ts";
import { versionCommand } from "./versionCommand.ts";
import { versionVariable } from "./versionVars.ts";
import { revisionVariable } from "./versionVars.ts";
import { versionProviderService } from "./VersionProvider.ts";

export const versionParticle: Particle = {
  consoleCommands: [
    versionCommand,
  ],
  environmentVariables: [
    revisionVariable,
    versionVariable,
  ],
  globalServices: [
    versionProviderService,
  ],
  key: "version",
};
