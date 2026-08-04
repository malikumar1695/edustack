import { RefreshToken } from "../../prisma/generated";
import { refreshTokenExpiry } from "../config/jwt";
import { prisma } from "../lib/prisma";
import { generateRefreshToken, hashToken } from "../utils/token";

export const issueRefreshToken = async (userId: string): Promise<string> => {
    const value = generateRefreshToken();
    await prisma.refreshToken.create({
        data: { userId, tokenHash: hashToken(value), expiresAt: refreshTokenExpiry() }
    });
    return value;
}

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
    return await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(token) } });
}

export const revokeRefreshToken = async (token: string): Promise<void> => {
    await prisma.refreshToken.update({
        where: { tokenHash: hashToken(token) },
        data: { revokedAt: new Date() }
    });
}

export const revokeAllForUser = async (userId: string): Promise<number> => {
    const { count } = await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() }
    });
    return count;
}

export const rotateRefreshToken = async (oldTokenId: string, userId: string): Promise<string> => {
    const newValue = generateRefreshToken();
    const newToken = await prisma.refreshToken.create({
        data: { userId, tokenHash: hashToken(newValue), expiresAt: refreshTokenExpiry() }
    });
    await prisma.refreshToken.update({
        where: { id: oldTokenId },
        data: { revokedAt: new Date(), replacedByTokenId: newToken.id }
    })
    return newValue;
}