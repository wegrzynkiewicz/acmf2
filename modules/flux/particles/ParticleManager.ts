import { Context } from "../context/Context.ts";
import { debug } from "../../debugger/debug.ts";
import { Particle } from "./Particle.ts";
import { PromiseCollector } from "../../useful/PromiseCollector.ts";

function getPrototypeName(object: unknown): string {
  if (typeof object === "object" && object !== null) {
    const prototype = Object.getPrototypeOf(object) as {
      ["constructor"]: { name: string };
    };
    return prototype.constructor.name;
  }
  return "";
}

export class ParticleManager {
  private readonly globalContext: Context;
  private readonly particles = new Set<Particle>();
  private readonly promiseCollector = new PromiseCollector();

  public constructor(
    { globalContext }: {
      globalContext: Context;
    },
  ) {
    this.globalContext = globalContext;
  }

  public async registerParticle(particle: Particle): Promise<void> {
    const particleName = getPrototypeName(particle);
    debug({
      channel: "FLUX",
      kind: "particle-registering",
      message: `Registering particle (${particleName})...`,
    });
    this.particles.add(particle);
    await this.runSingleParticleStage(particle, "bootstrap");
  }

  public async run<K extends keyof Particle>(stageName: K): Promise<void> {
    for (const particle of this.particles.values()) {
      void this.runSingleParticleStage(particle, stageName);
    }
    await this.promiseCollector.waitForAll();
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
      const promise = method.call(particle, this.globalContext);
      this.promiseCollector.add(promise);
      await promise;
    }
  }
}
