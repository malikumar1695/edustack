import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../prisma/generated";
import { ForbiddenError, InvalidRoleError } from "../errors/AppError";
import * as tokenRepo from "../repositories/refresh-token.repository";
import * as userRepo from "../repositories/user.repository";
import { UsernameTakenError } from "./auth.service";
import * as userService from "./user.service";

vi.mock("../repositories/user.repository");
vi.mock("../repositories/refresh-token.repository");
vi.mock("../utils/password", () => ({
    hashPassword: vi.fn(async () => "hashed"),
}));

const prismaError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError("db error", { code, clientVersion: "test" });

describe("user.service createUser", () => {
    beforeEach(() => vi.resetAllMocks());
    it("maps the created user's roles to names", async () => {
        vi.mocked(userRepo.createUserWithRole).mockResolvedValue({
            id: "u1", username: "user1", roles: [{ role: { name:"r1" } }]
        } as any);

        const result = await userService.createUser("user1", "pass123", ["r1"], true);

        expect(result).toEqual({
            id: "u1", username: "user1", roles: ["r1"]
        });
    });

    it("throws UsernameTakenError when the username is already taken", async () => {
        vi.mocked(userRepo.createUserWithRole).mockRejectedValue(prismaError('P2002'));

        await expect(userService.createUser("user1", "pass123", ["r1"], true)).rejects.toThrowError(UsernameTakenError);
    });

    it("throws InvalidRoleError when an invalid role is provided", async () => {
        vi.mocked(userRepo.createUserWithRole).mockRejectedValue(prismaError('P2003'));
        await expect(userService.createUser("user1", "pass123", ["invalid-role"], true)).rejects.toThrowError(InvalidRoleError);
    });
});

describe("user.service updateUser", () => {
    beforeEach(() => vi.resetAllMocks());

    it("refuses to let an admin disable their own account", async () => {
        await expect(userService.updateUser("u1", ["r1"], false, "u1"))
            .rejects.toThrowError(ForbiddenError);

        expect(userRepo.updateUser).not.toHaveBeenCalled();
    });

    it("allows an admin to edit their own account when staying active", async () => {
        vi.mocked(userRepo.updateUser).mockResolvedValue({
            id: "u1", username: "admin", isActive: true, roles: [{ role: { name: "admin" } }],
        } as any);

        await expect(userService.updateUser("u1", ["r1"], true, "u1")).resolves.toBeDefined();
    });

    it("revokes all sessions after updating a user", async () => {
        vi.mocked(userRepo.updateUser).mockResolvedValue({
            id: "u2", username: "user2", isActive: true, roles: [{ role: { name: "r1" } }]
        } as any);

        await userService.updateUser("u2", ["r1"], true, "admin-id");
        expect(tokenRepo.revokeAllForUser).toHaveBeenCalledWith("u2");
    });

});

describe("user.service deleteUser", () => {
    beforeEach(() => vi.resetAllMocks());

    it("refuses self-deletion", async () => {
        vi.mocked(userRepo.deleteUser).mockResolvedValue({} as any);
        await expect(userService.deleteUser("u1", "u1")).rejects.toThrowError(ForbiddenError);
        expect(userRepo.deleteUser).not.toHaveBeenCalled();

    });

    it("soft-deletes and revokes sessions", async () => {
        await userService.deleteUser("u2", "admin-id");

        expect(userRepo.deleteUser).toHaveBeenCalledWith("u2");
        expect(tokenRepo.revokeAllForUser).toHaveBeenCalledWith("u2");
    });
});

describe("user.service listUsers", () => {
    beforeEach(() => vi.resetAllMocks());

    it("converts page/pageSize into skip/take", async () => {
        vi.mocked(userRepo.listUsers).mockResolvedValue({ data: [], total: 0 } as any);

        await userService.listUsers(3, 10);

        expect(userRepo.listUsers).toHaveBeenCalledWith(20, 10);
    });

    it("flattens roles and derives `locked` from lockedUntil", async () => {
        vi.mocked(userRepo.listUsers).mockResolvedValue({
            data: [{
                id: "u1",
                username: "umer",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                lockedUntil: new Date(Date.now() + 60_000),
                roles: [{ role: { id: "r1", name: "admin" } }],
            }],
            total: 1,
        } as any);

        const result = await userService.listUsers(1, 10);

        expect(result.data[0].locked).toBe(true);
        expect(result.data[0].roles).toEqual([{ id: "r1", name: "admin" }]);
    });
});
