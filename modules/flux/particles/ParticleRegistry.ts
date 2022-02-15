import { debug } from "../../debugger/debug.ts";
import { Particle } from "./Particle.ts";
import { GlobalService } from "../context/GlobalService.ts";

export class ParticleRegistry {
  public readonly particles = new Set<Particle>();

  public async registerParticle(particle: Particle): Promise<void> {
    const { name } = particle;
    debug({
      channel: "FLUX",
      kind: "particle-registering",
      message: `Registering particle (${name})...`,
      parameters: { name },
    });
    this.particles.add(particle);
    if (particle.initParticles !== undefined) {
      await particle.initParticles({
        particleRegistry: this,
      });
    }
  }
}

export const particleRegistryService: GlobalService = {
  globalDeps: [],
  key: "particleRegistry",
  provider: async () => new ParticleRegistry(),
};
