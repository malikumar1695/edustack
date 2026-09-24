import { RoleName } from "@ilm/auth-kit";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";


const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const findUserByUsername = async (username: string) => {
    return await prisma.user.findFirst({
        where: { username, isDeleted: false },
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
    return prisma.user.findFirst({
        where: { id, isDeleted: false }, include: {
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

export const createUserWithRole = async (username: string, passwordHash: string, roles: string[], isActive: boolean,) => {

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
            isActive,
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

export const listUsers = async (skip: number, take: number, role?: RoleName) => {
    // `role` is an optional filter so one endpoint serves both the admin table
    // and role-scoped pickers, instead of a bespoke route per use case.
    const where = {
        isDeleted: false,
        ...(role ? { roles: { some: { role: { name: role } } } } : {}),
    };

    const [data, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                username: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                lockedUntil: true,
                roles: { select: { role: { select: { id: true, name: true } } } }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take
        }),
        prisma.user.count({ where })
    ],
        {
            // Cloud Run scales to zero and Neon suspends idle computes, so the
            // first request after a quiet period waits on both waking up.
            // Prisma's 2s default maxWait is well short of that, which made
            // cold visitors hit "Unable to start a transaction in the given time".
            maxWait: 15_000,
            timeout: 20_000,
        },
    );

    return { data, total };
}



export const listRoles = async () => {
    return await prisma.role.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
};

export const updateUser = async (userId: string, roleIds: string[], isActive: boolean) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            isActive,
            roles: {
                deleteMany: {},
                create: roleIds.map((roleId) => ({ roleId })),
            },
        },
        include: { roles: { include: { role: true } } },
    });
};

export const deleteUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            isDeleted: true,
        },
    });
};
