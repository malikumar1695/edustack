import { Prisma } from "../../prisma/generated";
import { InvalidRoleError } from "../errors/AppError";
import * as userRepo from "../repositories/user.repository";
import { Role } from "../types/Role";
import { hashPassword } from "../utils/password";
import { UsernameTakenError } from "./auth.service";

export const createUser = async (username: string, password: string, roles: string[]): Promise<{ id: string; username: string; roles: string[] }> => {
    const passwordHash = await hashPassword(password);

    try {
        const user = await userRepo.createUserWithRole(username, passwordHash, roles);
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
export const listUsers = async () => {
    const users = await userRepo.listUsers();
    return users.map((u) => ({
        id: u.id,
        username: u.username,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        locked: Boolean(u.lockedUntil && u.lockedUntil > new Date()),
        roles: u.roles,
    }));
};

export const listRoles = async () => {
    return await userRepo.listRoles();

};

export const updateUser = async (id: string, roleIds: string[]) => {
    const user = await userRepo.updateUserRoles(id, roleIds);
    return { id: user.id, username: user.username, roles: user.roles.map((r) => r.role.name) };
};
