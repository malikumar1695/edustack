import { beforeEach, describe, expect, it, vi } from "vitest";
import * as tokenRepo from "../repositories/refresh-token.repository";
import * as userRepo from "../repositories/user.repository";
import { hashPassword } from "../utils/password";
import * as authService from "./auth.service";
import { RefreshTokenReuseDetectedError } from "../errors/AppError";


vi.mock("../repositories/user.repository");
vi.mock("../repositories/refresh-token.repository");
vi.mock("../config/jwt", () => ({
    signAccessToken: vi.fn(() => "fake.access.token"),
    refreshTokenExpiry: vi.fn(() => new Date(Date.now() + 3600_000)),
}));

describe("auth.service login", () => {
    beforeEach(() => vi.resetAllMocks());

    it("throws InvalidCredentialsError when the user doesn't exist", async () => {

        vi.mocked(userRepo.findUserByUsername).mockResolvedValue(null);
        await expect(authService.login("ghost", "whatever")).rejects.toThrowError(authService.InvalidCredentialsError);
    });

    it("throws AccountLockedError when the user is locked", async () => {
        vi.mocked(userRepo.findUserByUsername).mockResolvedValue({
            id: "u1",
            username: "umer",
            passwordHash: await hashPassword("correct"),
            lockedUntil: new Date(Date.now() + 60000), // locked for 60 seconds
            roles: [{ role: { name: "user" } }]
        } as any);
        await expect(authService.login("umer", "correct")).rejects.toThrowError(authService.AccountLockedError);
    });

    it("throws InvalidCredentialsError on wrong password", async () => {
        vi.mocked(userRepo.findUserByUsername).mockResolvedValue({
            id: "u1",
            username: "umer",
            passwordHash: await hashPassword("correct"),
            lockedUntil: null,
            roles: [{ role: { name: "user" } }]
        } as any);
        await expect(authService.login("umer", "wrongpassword")).rejects.toThrowError(authService.InvalidCredentialsError);
    })

    it("returns tokens and resets failed login attempts on successful login", async () => {
        vi.mocked(userRepo.findUserByUsername).mockResolvedValue({
            id: "u1",
            username: "umer",
            passwordHash: await hashPassword("correct"),
            lockedUntil: null,
            roles: [{ role: { name: "user" } }],
        } as any);

        vi.mocked(tokenRepo.issueRefreshToken).mockResolvedValue("new-refresh-token");

        const result = await authService.login("umer", "correct");

        expect(result.accessToken).toBeTypeOf("string");
        expect(result.refreshToken).toBe("new-refresh-token");
        expect(userRepo.resetFailedLoginAttempts).toHaveBeenCalledWith("u1");
    });
});

describe("auth.service register", () => {

    beforeEach(() => vi.resetAllMocks());

    it("throws UsernameTakenError when the username is already taken", async () => {
        const { Prisma } = await import("../../prisma/generated");
        vi.mocked(userRepo.createUser).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError("Unique constraint failed",
                {
                    code: 'P2002',
                    clientVersion: "test"
                }
            )
        );

        await expect(authService.register("existinguser", "password123")).rejects.toThrowError(authService.UsernameTakenError);
    });
});

describe("auth.service refresh", () => {
    beforeEach(() => vi.resetAllMocks());

    it("throws RefreshTokenReuseDetectedError and revokes all tokens when a revoked token is reused", async () => {
        vi.mocked(tokenRepo.findRefreshToken).mockResolvedValue({
            id: "rt1",
            userId: "u1",
            expiresAt: new Date(Date.now() + 1000),
            revokedAt: new Date(), // already used once
        } as any);

        await expect(authService.refresh("stolen-token")).rejects.toThrow(RefreshTokenReuseDetectedError);
        expect(tokenRepo.revokeAllForUser).toHaveBeenCalledWith("u1");
    });
});