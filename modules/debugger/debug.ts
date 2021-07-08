interface DebugOptions {
  [key: string]: unknown;
  kind: string;
  message: string;
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
    const allow = Deno.env.get("APP_DEBUGGER_ENABLED");
    if (allow === "1") {
      debug = consoleDebug;
    }
  } catch {
    // nothing
  }
}

debug({
  kind: 'debugger-info',
  message: 'Debugger enabled.'
});

export { debug };
