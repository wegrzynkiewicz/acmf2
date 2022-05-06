import { Particle } from "../flux/particles/Particle.ts";
import { logBusService } from "./LogBus.ts";
import { loggerFactoryService } from "./LoggerFactory.ts";
import {
  enabledVariable,
  stderrEnabledVariable,
  stderrMinSeverityVariable,
  stdoutEnabledVariable,
  stdoutMinSeverityVariable,
  tagsVariable,
} from "./logVars.ts";

export const logParticle: Particle = {
  environmentVariables: [
    enabledVariable,
    tagsVariable,
    stderrEnabledVariable,
    stderrMinSeverityVariable,
    stdoutEnabledVariable,
    stdoutMinSeverityVariable,
  ],
  globalServices: [
    logBusService,
    loggerFactoryService,
  ],
  key: "log",
};
