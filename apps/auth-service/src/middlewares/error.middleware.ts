import { ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "../errors/AppError";


export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (err instanceof ValidationError) {
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
        res.status(err.statusCode).json({
            error: { code: err.code, message: err.message }
        });
        return;
    }

    console.error(err);
    res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    });
}