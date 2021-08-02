import { Context } from "../context/Context.ts";
import { debug } from "../../debugger/debug.ts";
import { Particle } from "./Particle.ts";
import { ParticleRegistry } from "./ParticleRegistry.ts";
import { getPrototypeName } from "../../common/getPrototypeName.ts";

export class ParticleManager {
  private readonly globalContext: Context;
  private readonly particleRegistry: ParticleRegistry;

  public constructor(
    { globalContext, particleRegistry }: {
      globalContext: Context;
      particleRegistry: ParticleRegistry;
    },
  ) {
    this.globalContext = globalContext;
    this.particleRegistry = particleRegistry;
  }

  public async run<K extends keyof Particle>(stageName: K): Promise<void> {
    const particles = [...this.particleRegistry.particles.values()];
    const promises = particles.map(async (particle) => {
      await this.runSingleParticleStage(particle, stageName);
    });
    await Promise.all(promises);
  }

  private async runSingleParticleStage<K extends keyof Particle>(
    particle: Particle,
    stageName: K,
  ): Promise<void> {
    if (typeof particle[stageName] === "function") {
      const particleName = getPrototypeName(particle);
      debug({
        channel: "FLUX",
        kind: "particle-executing",
        message: `Particle executing (${particleName}.${stageName})...`,
      });
      const method = particle[stageName] as ((
        globalContext: Context,
      ) => Promise<void>);
      await method.call(particle, this.globalContext);
    }
  }
}
