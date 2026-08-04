
import { signAccessToken } from "../config/jwt";
import * as userRepo from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/password";
import * as tokenRepo from "../repositories/refresh-token.repository";
import { Prisma } from "../../prisma/generated";
import { AppError } from "../errors/AppError";

export class InvalidCredentialsError extends AppError {
    constructor() { super("Invalid username or password", 401, "INVALID_CREDENTIALS"); }
}
export class AccountLockedError extends AppError {
    constructor() { super("Account is locked. Please try again later.", 403, "ACCOUNT_LOCKED"); }
}
export class UsernameTakenError extends AppError {
    constructor() { super("Username is already taken", 409, "USERNAME_TAKEN"); }
}

export const login = async (username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> => {
    const user = await userRepo.findUserByUsername(username);
    if (!user) {
        throw new InvalidCredentialsError();
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new AccountLockedError();
    }

    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
        throw new InvalidCredentialsError();
    }

    await userRepo.resetFailedLoginAttempts(user.id);

    const accessToken = signAccessToken({ sub: user.id, username: user.username, roles: user.roles });
    const refreshToken = await tokenRepo.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
}

export const refresh = async (refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> => {
    const stored = await tokenRepo.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date())
        throw new InvalidCredentialsError();

    if (stored.revokedAt) {
        // token reuse: someone is trying to use a refresh token that has already been used
        await tokenRepo.revokeAllForUser(stored.userId);
        throw new InvalidCredentialsError();
    }

    const newRefreshToken = await tokenRepo.rotateRefreshToken(stored.id, stored.userId);
    const user = await userRepo.findUserById(stored.userId);
    if (!user) throw new InvalidCredentialsError();

    const accessToken = signAccessToken({ sub: user.id, username: user.username, roles: user.roles });

    return { accessToken, refreshToken: newRefreshToken };
}

export const logout = async (refreshToken: string): Promise<void> => {
    const stored = await tokenRepo.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) await tokenRepo.revokeRefreshToken(refreshToken);
}

export const register = async (username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> => {
    const passwordHash = await hashPassword(password);

    let user;
    try {
        user = await userRepo.createUser(username, passwordHash);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new UsernameTakenError();
        }
        throw error;
    }

    const accessToken = signAccessToken({ sub: user.id, username: user.username, roles: user.roles });
    const refreshToken = await tokenRepo.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
}