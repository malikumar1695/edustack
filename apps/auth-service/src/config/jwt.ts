import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { TOKEN_ISSUER, type AccessTokenPayload } from "@ilm/auth-kit";

/**
 * auth-service is the only service holding the private key — it signs.
 * Verification lives in @ilm/auth-kit and needs only the public half, which
 * is what every other service gets.
 *
 * Mirrors auth-kit's loader: JWT_PRIVATE_KEY holds the PEM inline (env vars
 * can't carry real newlines, so "
" is unescaped) for container deploys;
 * JWT_PRIVATE_KEY_PATH points at a file for local development. The key file
 * is gitignored and excluded from the image, so the inline form is the only
 * one available in a container.
 */
let cachedPrivateKey: string | undefined;

const getPrivateKey = (): string => {
    if (cachedPrivateKey) return cachedPrivateKey;

    const inline = process.env.JWT_PRIVATE_KEY;
    if (inline) {
        cachedPrivateKey = inline.replace(/\\n/g, "\n");
        return cachedPrivateKey;
    }

    const path = process.env.JWT_PRIVATE_KEY_PATH;
    if (path) {
        cachedPrivateKey = readFileSync(path, "utf-8");
        return cachedPrivateKey;
    }

    throw new Error("Set JWT_PRIVATE_KEY (inline PEM) or JWT_PRIVATE_KEY_PATH (file path).");
};

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export { verifyAccessToken, type AccessTokenPayload } from "@ilm/auth-kit";

export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, getPrivateKey(), {
        algorithm: "RS256",
        expiresIn: ACCESS_TOKEN_EXPIRATION,
        issuer: TOKEN_ISSUER,
    });
};

export const refreshTokenExpiry = (): Date => {
    return new Date(Date.now() + REFRESH_TOKEN_EXPIRATION);
};
