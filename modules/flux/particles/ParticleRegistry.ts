import { debug } from "../../debugger/debug.ts";
import { Particle } from "./Particle.ts";
import { getPrototypeName } from "../../common/getPrototypeName.ts";
import { GlobalService } from "../context/GlobalService.ts";

export class ParticleRegistry {
  public readonly particles = new Set<Particle>();

  public async registerParticle(particle: Particle): Promise<void> {
    const particleName = getPrototypeName(particle);
    debug({
      channel: "FLUX",
      kind: "particle-registering",
      message: `Registering particle (${particleName})...`,
    });
    this.particles.add(particle);
    if (particle.initParticles !== undefined) {
      const particleRegistry = this;
      await particle.initParticles({ particleRegistry });
    }
  }
}

export const particleRegistryService: GlobalService = {
  globalDeps: [],
  key: "particleRegistry",
  provider: async () => new ParticleRegistry(),
};
