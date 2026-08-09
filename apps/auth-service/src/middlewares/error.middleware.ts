import { ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "../errors/AppError";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const requestId = req.id;

    if (err instanceof ValidationError) {
        req.log.warn({ code: err.code, message: err.message, details: err.details }, "request validation error");
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
        return;
    }
    if (err instanceof AppError) {
        req.log.warn({ code: err.code }, err.message);
        res.status(err.statusCode).json({
            error: { code: err.code, message: err.message }
        });
        return;
    }

    req.log.error({ err }, "unhandled error");

    res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred.", requestId }
    });
}