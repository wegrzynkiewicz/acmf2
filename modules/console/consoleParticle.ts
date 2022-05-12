import { Particle } from "../flux/particles/Particle.ts";
import { StandardStreams } from "../flux/streams/StandardStreams.ts";
import { ConsoleCommandExecutor } from "./runtime/ConsoleCommandExecutor.ts";
import { createStreamConsoleOutput } from "./runtime/StreamConsoleOutput.ts";
import { mainCommand } from "./embedded/mainCommand.ts";

async function execute(
  {
    consoleCommandExecutor,
    standardStreams,
    startUpArgs,
  }: {
    consoleCommandExecutor: ConsoleCommandExecutor;
    standardStreams: StandardStreams;
    startUpArgs: string[];
  },
): Promise<number> {
  const { stderr, stdout } = standardStreams;
  const output = createStreamConsoleOutput({ stderr, stdout });
  const exitCode = await consoleCommandExecutor.executeCommand({
    args: [...startUpArgs],
    currentCommand: mainCommand,
    command: mainCommand,
    output,
  });
  return exitCode;
}

export const consoleParticle: Particle = {
  consoleCommands: [
    mainCommand,
  ],
  executors: [
    execute,
  ],
  key: "console",
};
