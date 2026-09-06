import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { join } from "path";
import { TOKEN_ISSUER, type AccessTokenPayload } from "@ilm/auth-kit";

/**
 * auth-service is the only service holding the private key — it signs.
 * Verification lives in @ilm/auth-kit and needs only the public half, which
 * is what every other service gets.
 */
const privateKey = readFileSync(join(__dirname, "../../keys/private.pem"), "utf-8");

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export { verifyAccessToken, type AccessTokenPayload } from "@ilm/auth-kit";

export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: ACCESS_TOKEN_EXPIRATION,
        issuer: TOKEN_ISSUER,
    });
};

export const refreshTokenExpiry = (): Date => {
    return new Date(Date.now() + REFRESH_TOKEN_EXPIRATION);
};
