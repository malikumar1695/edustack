import { prisma } from "../lib/prisma";
import { Role } from "../types/Role";


const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const findUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({
        where: { username },
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    });
}

export function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id }, include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    });
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
        data: { username, passwordHash },
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    });
}

export const createUserWithRole = async (username: string, passwordHash: string, roles: string[]) => {

    if (roles.length === 0) throw new Error("At least one role is required");

    const ids = roles;

    const found = await prisma.role.findMany({
        where: { id: { in: ids } },
        select: { id: true },
    });

    if (found.length !== ids.length) {
        const foundIds = new Set(found.map((r) => r.id));
        const missing = ids.filter((id) => !foundIds.has(id));
        throw new Error(`Roles not found: ${missing.join(", ")}`);
    }

    return await prisma.user.create({
        data: {
            username,
            passwordHash,
            roles: {
                create: roles.map((roleId) => ({
                    role: {
                        connect: { id: roleId }
                    }
                }))
            }
        },
        include: { roles: { include: { role: true } } }
    });
}

export const listUsers = async (skip: number, take: number) => {
    const [data, total] = await prisma.$transaction([
        prisma.user.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                lockedUntil: true,
                roles: { select: { role: { select: { id: true, name: true } } } }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take
        }),
        prisma.user.count()
    ]);

    return { data, total };
}

export const listRoles = async () => {
    return await prisma.role.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
};

export const updateUserRoles = async (userId: string, roleIds: string[]) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            roles: {
                deleteMany: {},
                create: roleIds.map((roleId) => ({ roleId })),
            },
        },
        include: { roles: { include: { role: true } } },
    });
};
