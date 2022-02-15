import { debug } from "../../debugger/debug.ts";
import { Particle } from "./Particle.ts";
import { ParticleRegistry } from "./ParticleRegistry.ts";
import { getPrototypeName } from "../../common/getPrototypeName.ts";
import { GlobalService } from "../context/GlobalService.ts";
import { GlobalContext } from "../context/Context.ts";

export interface ParticleManager {
  run<K extends keyof Particle>(stageName: K): Promise<void>;
}

export const particleManagerService: GlobalService = {
  globalDeps: ["globalContext", "particleRegistry"],
  key: "particleManager",
  provider: provideParticleManager,
};

export async function provideParticleManager(
  { globalContext, particleRegistry }: {
    globalContext: GlobalContext;
    particleRegistry: ParticleRegistry;
  },
): Promise<ParticleManager> {
  async function runSingleParticleStage<K extends keyof Particle>(
    particle: Particle,
    stageName: K,
  ): Promise<void> {
    if (typeof particle[stageName] === "function") {
      debug({
        channel: "FLUX",
        kind: "particle-executing",
        message: `Particle executing (${particle.name}.${stageName})...`,
      });
      const method = particle[stageName] as ((
        globalContext: GlobalContext,
      ) => Promise<void>);
      await method.call(particle, globalContext);
    }
  }

  async function run<K extends keyof Particle>(stageName: K): Promise<void> {
    const particles = [...particleRegistry.particles.values()];
    const promises = particles.map(async (particle) => {
      await runSingleParticleStage(particle, stageName);
    });
    await Promise.all(promises);
  }

  return { run };
}
