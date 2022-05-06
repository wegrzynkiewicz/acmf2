import { Particle } from "./Particle.ts";
import { GlobalService } from "../context/global.ts";
import { Registry } from "../../common/Registry.ts";

export type ParticleRegistry = Registry<Particle>;

export const particleRegistryService: GlobalService<ParticleRegistry> = {
  globalDeps: [],
  key: "particleRegistry",
  provider: async () => new Registry<Particle>(),
};
