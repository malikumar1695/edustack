import { Prisma } from "../../prisma/generated";
import { ForbiddenError, InvalidRoleError } from "../errors/AppError";
import * as userRepo from "../repositories/user.repository";
import * as tokenRepo from "../repositories/refresh-token.repository";
import { hashPassword } from "../utils/password";
import { UsernameTakenError } from "./auth.service";

export const createUser = async (username: string, password: string, roles: string[],   isActive: boolean): Promise<{ id: string; username: string; roles: string[] }> => {
    const passwordHash = await hashPassword(password);

    try {
        const user = await userRepo.createUserWithRole(username, passwordHash, roles, isActive);
        return {
            id: user.id,
            username: user.username,
            roles: user.roles.map((r) => r.role.name),
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new UsernameTakenError();
            }
            if (error.code === "P2003" || error.code === "P2025") throw new InvalidRoleError();
            throw error;
        }
        throw error;
    };
}
export const listUsers = async (page: number, pageSize: number) => {
    const { data, total } = await userRepo.listUsers((page - 1) * pageSize, pageSize);

    return {
        data: data.map((u) => ({
            id: u.id,
            username: u.username,
            isActive: u.isActive,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            locked: Boolean(u.lockedUntil && u.lockedUntil > new Date()),
            roles: u.roles.map((r) => r.role),
        })),
        total,
    };
};

export const listRoles = async () => {
    return await userRepo.listRoles();

};

export const updateUser = async (id: string, roleIds: string[], isActive: boolean) => {
    const user = await userRepo.updateUser(id, roleIds, isActive);
    return { id: user.id, username: user.username, roles: user.roles.map((r) => r.role.name) };
};


export const deleteUser = async (id: string, actorId: string) => {
    if (id === actorId) throw new ForbiddenError("You cannot delete your own account.");
    await userRepo.deleteUser(id);
    await tokenRepo.revokeAllForUser(id);
};