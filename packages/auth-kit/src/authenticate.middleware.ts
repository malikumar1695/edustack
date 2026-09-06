import { UnauthorizedError } from "@ilm/http-kit";
import { Request, RequestHandler, Response } from "express";
import { verifyAccessToken } from "./jwt";

/**
 * Verifies the bearer token locally against the public key — no database
 * lookup and no call back to auth-service, so this keeps working even if
 * auth-service is down.
 */
export const authenticate: RequestHandler = (req: Request, _res: Response, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Missing or malformed Authorization header");
    }

    try {
        req.user = verifyAccessToken(header.slice("Bearer ".length));
        next();
    } catch {
        throw new UnauthorizedError("Invalid or expired access token");
    }
};
