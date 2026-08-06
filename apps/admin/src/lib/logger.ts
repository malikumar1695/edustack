

type logFields = Record<string, unknown>;

const isDev = import.meta.env.DEV;

const emit = (level: "debug" | "info" | "warn" | "error", message: string, fields?: logFields) => {

    if (isDev) {
        console[level === "debug" ? "log" : level](`${level}] ${message}`, fields ?? "");
        return;
    }
    if (level === "debug") return; // don't log debug in production
    console[level](JSON.stringify({ level, message, ...fields, ts: new Date().toISOString() }));
};

export const logger = {
    debug: (message: string, fields?: logFields) => emit("debug", message, fields),
    info: (message: string, fields?: logFields) => emit("info", message, fields),
    warn: (message: string, fields?: logFields) => emit("warn", message, fields),
    error: (message: string, fields?: logFields) => emit("error", message, fields),
};