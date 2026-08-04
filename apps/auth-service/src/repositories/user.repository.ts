import { prisma } from "../lib/prisma";


const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const findUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({ where: { username } });
}

export function findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}

export const registerFailedLoginAttempt = async (userId: string, currentAttempt: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const attempts = currentAttempt + 1;
    return await prisma.user.update({
        where: { id: userId },
        data: {
            failedLoginAttempts: attempts,
            lockedUntil: attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : undefined
        }
    });
}

export const resetFailedLoginAttempts = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            failedLoginAttempts: 0,
            lockedUntil: null
        }
    });
}

export const createUser = async (username: string, passwordHash: string) => {
    return await prisma.user.create({
        data: { username, passwordHash }
    });
}