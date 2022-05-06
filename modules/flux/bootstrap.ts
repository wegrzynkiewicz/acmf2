import { consoleCommandRegistryService } from "../console/runtime/ConsoleCommandRegistry.ts";
import { createGlobalContext } from "./context/global.ts";
import { globalServiceRegistryService } from "./context/GlobalServiceRegistry.ts";
import { GlobalServiceResolver } from "./context/GlobalServiceResolver.ts";
import { environmentVariableRegistryService } from "./env/EnvironmentVariableRegistry.ts";
import { Particle } from "./particles/Particle.ts";
import { particleRegistryService } from "./particles/ParticleRegistry.ts";

export async function bootstrap(
  { particles }: {
    particles: Particle[];
  },
): Promise<void> {
  const globalContext = createGlobalContext();
  const globalServiceResolver = new GlobalServiceResolver();

  const [
    consoleCommandRegistry,
    environmentVariableRegistry,
    globalServiceRegistry,
    particleRegistry,
  ] = await Promise.all([
    globalServiceResolver.resolveService(consoleCommandRegistryService),
    globalServiceResolver.resolveService(environmentVariableRegistryService),
    globalServiceResolver.resolveService(globalServiceRegistryService),
    globalServiceResolver.resolveService(particleRegistryService),
  ]);

  function processParticle(particle: Particle): void {
    particleRegistry.register(particle);
    for (const command of particle.consoleCommands ?? []) {
      consoleCommandRegistry.register(command);
    }
    for (const service of particle.globalServices ?? []) {
      globalServiceRegistry.register(service);
    }
    for (const variable of particle.environmentVariables ?? []) {
      environmentVariableRegistry.register(variable);
    }
    for (const childParticle of particle.particles ?? []) {
      processParticle(childParticle);
    }
  }

  for (const particle of particles) {
    processParticle(particle);
  }

  for (const particle of particles) {
    for (const executor of particle.executors ?? []) {
      executor(globalContext);
    }
  }
}
