import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

/**
 * Pretty-printed in development, raw JSON to stdout in production so a log
 * aggregator (CloudWatch, Railway, …) can parse and query the fields.
 */
export const logger = pino({
    level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            'res.headers["set-cookie"]',
            "*.password",
            "*.passwordHash",
            "*.accessToken",
            "*.refreshToken",
        ],
        censor: "[REDACTED]",
    },
    transport: isProd
        ? undefined
        : {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname",
              },
          },
});
