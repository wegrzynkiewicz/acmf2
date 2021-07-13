import { Context } from "../../context/Context.ts";
import { debug } from "../../debugger/debug.ts";
import { Particle } from "./Particle.ts";

function getPrototypeName(object: unknown): string {
  if (typeof object === "object" && object) {
    const prototype = Object.getPrototypeOf(object) as {
      ["constructor"]: { name: string };
    };
    return prototype.constructor.name;
  }
  return "";
}

export class ParticleManager {
  private readonly particles = new Set<Particle>();
  private readonly globalContext: Context;

  public constructor(
    { globalContext }: {
      globalContext: Context;
    },
  ) {
    this.globalContext = globalContext;
  }

  public registerParticle(particle: Particle): void {
    const particleName = getPrototypeName(particle);
    debug({
      channel: "FLUX",
      kind: "particle-registering",
      message: `Registering particle (${particleName})...`,
    });
    this.particles.add(particle);
  }

  public async run<K extends keyof Particle>(stageName: K): Promise<void> {
    const promises = [...this.particles.values()].map(async (particle) => {
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
