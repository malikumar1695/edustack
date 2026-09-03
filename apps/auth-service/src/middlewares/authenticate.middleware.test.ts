


import { describe, expect, it, vi } from "vitest";
import { authenticate } from "./authenticate.middleware";
import { signAccessToken } from "../config/jwt";
import type { Request, Response } from "express";
import { UnauthorizedError } from "../errors/AppError";

const reqWith = (authorization?: string) => ({ headers: { authorization } }) as unknown as Request;
const res = {} as unknown as Response;

describe("authenticate", () => {

    it("attaches claims and calls next for a valid token", () => {
        const next = vi.fn();
        const token = signAccessToken({ sub: "u1", username: "user1", roles: ["admin"] });
        const req = reqWith(`Bearer ${token}`);

        authenticate(req, res, next);
        expect(req.user?.sub).toBe("u1");
        expect(req.user?.roles).toEqual(["admin"]);
        expect(next).toHaveBeenCalled();
    });

    it("rejects a header without the Bearer scheme", () => {
        expect(() => authenticate(reqWith("token-without-scheme"), res, vi.fn())).toThrowError(UnauthorizedError);
    });

    it("rejects a tampered token", () => {
        const next = vi.fn();

        const token = signAccessToken({ sub: "u1", username: "user1", roles: ["admin"] });
        const tamperedToken = token.slice(0, -3) + 'xxx';
        expect(() => authenticate(reqWith(`Bearer ${tamperedToken}`), res, next)).toThrowError(UnauthorizedError);
    });

});