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

let lastTime = Date.now();
function prettyDebug(options: DebugOptions): void {
  const { channel, message } = options;
  const now = Date.now();
  console.log(`\x1b[34m%s\x1b[0m %s \x1b[36m+%sms\x1b[0m`, channel, message, now - lastTime);
  lastTime = now;
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
    if (allow === "2") {
      debug = prettyDebug;
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
