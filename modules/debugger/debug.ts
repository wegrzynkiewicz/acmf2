interface DebugOptions {
  channel: string;
  kind: string;
  message: string;
  parameters?: Record<string, unknown>;
}

interface DebugFunction {
  (options: DebugOptions): void;
}

function consoleDebug(options: DebugOptions): void {
  const args = {
    time: (new Date()).toISOString(),
    ...options,
  };
  const json = JSON.stringify(args);
  console.log(json);
}

let debug: DebugFunction = (): void => {
  // nothing
};

if (typeof Deno === "object") {
  try {
    const allow = Deno.env.get("DEBUG");
    if (allow === "1") {
      debug = consoleDebug;
    }
  } catch {
    // nothing
  }
}

debug({
  channel: "DEBUGGER",
  kind: "debugger-info",
  message: "Debugger enabled.",
});

export { debug };
