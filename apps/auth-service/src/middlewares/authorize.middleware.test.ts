import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { requireRole } from "./authorize.middleware";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";


const mockReq = (roles?: string[]): Request => {
    return {
        user: roles ? { sub: "u1", username: "umer", roles } : undefined,
        log: { warn: vi.fn() }
    } as unknown as Request;
}

const res = {} as Response;

describe("authorize middleware", () => {

    it("calls next when user holds an allowed role", () => {
        const next = vi.fn();
        requireRole("admin")(mockReq(["admin"]), res, next);
        expect(next).toHaveBeenCalled();
    });

    it("throws ForbiddenError when the user holds a role that is not allowed", () => {
        const next = vi.fn();
        const req = mockReq(["user"]);
        expect(() => requireRole("admin")(req, res, next)).toThrowError(ForbiddenError);
        expect(req.log.warn).toHaveBeenCalled();
    });

    it("throws UnauthorizedError when the user is not authenticated", () => {
        const next = vi.fn();
        expect(() => requireRole("admin")(mockReq(), res, next)).toThrowError(UnauthorizedError);
    });
});