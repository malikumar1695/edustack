import { readFileSync } from "fs";
import jwt from "jsonwebtoken";

export const TOKEN_ISSUER = "auth-service";

export interface AccessTokenPayload {
    sub: string;
    username: string;
    roles: string[];
}

let cachedPublicKey: string | undefined;

/**
 * Only the public half of the RS256 keypair lives here, so a service using
 * this kit can verify tokens but never mint them — a compromise of any
 * consumer can't forge an admin token.
 *
 * JWT_PUBLIC_KEY holds the PEM inline (env vars can't carry real newlines, so
 * "\n" is unescaped) for container deploys; JWT_PUBLIC_KEY_PATH points at a
 * file for local development.
 */
const getPublicKey = (): string => {
    if (cachedPublicKey) return cachedPublicKey;

    const inline = process.env.JWT_PUBLIC_KEY;
    if (inline) {
        cachedPublicKey = inline.replace(/\\n/g, "\n");
        return cachedPublicKey;
    }

    const path = process.env.JWT_PUBLIC_KEY_PATH;
    if (path) {
        cachedPublicKey = readFileSync(path, "utf-8");
        return cachedPublicKey;
    }

    throw new Error("Set JWT_PUBLIC_KEY (inline PEM) or JWT_PUBLIC_KEY_PATH (file path).");
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    // Pinning `algorithms` is what blocks algorithm-confusion attacks: without
    // it a forged token could declare "alg":"none", or be HMAC-signed using
    // this public key as the shared secret.
    return jwt.verify(token, getPublicKey(), {
        algorithms: ["RS256"],
        issuer: TOKEN_ISSUER,
    }) as AccessTokenPayload;
};

/**
 * Declared here rather than in a standalone .d.ts because ambient files under
 * src/ are not emitted to dist/, which would silently drop the augmentation
 * for anything consuming the built package.
 */
declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}
