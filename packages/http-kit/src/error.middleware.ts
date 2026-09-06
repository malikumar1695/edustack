import { ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "./errors";

/**
 * Expected failures (AppError subclasses) are logged at warn with their code
 * so they stay filterable; anything unexpected is logged at error with its
 * stack and reported to the client as a generic 500. Every response carries
 * the request id so a user-reported failure maps to one log line.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const requestId = req.id;

    if (err instanceof ValidationError) {
        req.log.warn(
            { code: err.code, message: err.message, details: err.details },
            "request validation error",
        );
        res.status(err.statusCode).json({
            error: { code: err.code, message: err.message, details: err.details, requestId },
        });
        return;
    }

    if (err instanceof AppError) {
        req.log.warn({ code: err.code }, err.message);
        res.status(err.statusCode).json({
            error: { code: err.code, message: err.message, requestId },
        });
        return;
    }

    req.log.error({ err }, "unhandled error");
    res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred.", requestId },
    });
};
