import { Prisma } from "../../prisma/generated";
import * as userRepo from "../repositories/user.repository";
import { hashPassword } from "../utils/password";
import { UsernameTakenError } from "./auth.service";

export const createUser = async (username: string, password: string, roleName: string) => {
    const passwordHash = await hashPassword(password);

    try {
        const user = await userRepo.createUserWithRole(username, passwordHash, roleName);
        return {
            id: user.id,
            username: user.username,
            roles: user.roles.map((r) => r.role.name),
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new UsernameTakenError();
        }
        throw error;
    }
};

export const listUsers = async () => {
    const users = await userRepo.listUsers();
    return users.map((u) => ({
        id: u.id,
        username: u.username,
        createdAt: u.createdAt,
        locked: Boolean(u.lockedUntil && u.lockedUntil > new Date()),
        roles: u.roles.map((r) => r.role.name),
    }));
};
