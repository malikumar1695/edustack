import { randomBytes, createHash } from 'crypto';

export const generateRefreshToken = (): string => {
    return randomBytes(48).toString("base64url");

}

export const hashToken = (token: string): string => {
    return createHash("sha256").update(token).digest("hex");
}