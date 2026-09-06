import { randomUUID } from "crypto";
import pinoHttp from "pino-http";
import { logger } from "./logger";

/**
 * Access logs plus a request id that propagates across services: an incoming
 * x-request-id is reused, otherwise one is generated, and it is echoed back on
 * the response so a client-side failure can be matched to a server log line.
 */
export const requestLogger = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const header = req.headers["x-request-id"];
        const id = (Array.isArray(header) ? header[0] : header) ?? randomUUID();
        res.setHeader("x-request-id", id);
        return id;
    },
    customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
    serializers: {
        req: (req) => ({ method: req.method, url: req.url, id: req.id }),
    },
});
