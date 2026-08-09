import { describe, expect, it, vi } from "vitest"
import type { Request, Response } from "express";
import { RefreshTokenMissingError, ValidationError } from "../errors/AppError";
import { errorHandler } from "./error.middleware";


const mockReqRes = (): { req: Request; res: Response } => {
    const req = { id: "req-123", log: { warn: vi.fn(), error: vi.fn() } } as unknown as Request;
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),

    } as unknown as Response;

    return { req, res };
}

describe("errorHandler middleware", () => {

    it("maps ValidationError to 400 response with details and requestId", () => {

        const { req, res } = mockReqRes();
        const err = new ValidationError([{ field: "username", messages: ["Username is required"] }]);

        errorHandler(err, req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                details: err.details,
                requestId: "req-123"
            }
        });

    });

    it("maps a plain AppError to its own status/code", () => {
        const { req, res } = mockReqRes();

        errorHandler(new RefreshTokenMissingError(), req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: "REFRESH_TOKEN_MISSING",
                message: "Refresh token missing",
                requestId: "req-123"
            }
        });
    });

    it("maps an unknown error to 500 and logs it", () => {
        const { req, res } = mockReqRes();

        errorHandler(new Error("Unexpected error"), req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                requestId: "req-123"
            }
        });
    });
}); 
