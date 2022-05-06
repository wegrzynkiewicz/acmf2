import { Particle } from "../flux/particles/Particle.ts";
import { currentDateProviderService } from "./CurrentDateProvider.ts";

export const dateParticle: Particle = {
  globalServices: [
    currentDateProviderService,
  ],
  key: "date",
};
