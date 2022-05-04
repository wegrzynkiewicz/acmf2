import { GlobalService } from "../flux/context/global.ts";

export interface CurrentDateProvider {
  provideCurrentDate: () => Date;
}

export function provideCurrentDate(): Date {
  const currentDate = new Date();
  return currentDate;
}

export const currentDateProviderService: GlobalService = {
  key: "currentDateProvider",
  globalDeps: [],
  provider: async () => ({ provideCurrentDate }),
};
