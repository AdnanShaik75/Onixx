type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

function formatEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const ctx = entry.context ? ` [${entry.context}]` : "";
  const msg = `${base}${ctx} ${entry.message}`;
  return entry.data ? `${msg} ${JSON.stringify(entry.data)}` : msg;
}

function createLogger(context?: string) {
  const isDev = process.env.NODE_ENV !== "production";

  function log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    };

    if (isDev) {
      const formatted = formatEntry(entry);
      switch (level) {
        case "error":
          console.error(formatted);
          break;
        case "warn":
          console.warn(formatted);
          break;
        case "debug":
          console.debug(formatted);
          break;
        default:
          console.log(formatted);
      }
    }
  }

  return {
    info: (message: string, data?: unknown) => log("info", message, data),
    warn: (message: string, data?: unknown) => log("warn", message, data),
    error: (message: string, error?: unknown) => {
      const data = error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
      log("error", message, data);
    },
    debug: (message: string, data?: unknown) => log("debug", message, data),
  };
}

export const logger = createLogger("app");
export { createLogger };
